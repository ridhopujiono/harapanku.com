import { fail } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { appointments, articles, assessmentPackages, services } from '$lib/server/schema';
import { DEFAULT_ARTICLES, type ArticleItem } from '$lib/data/articles-defaults';
import { DEFAULT_PACKAGES, DEFAULT_SERVICES } from '$lib/data/defaults';
import { normalizeWa } from '$lib/server/auth';
import { loadLandingCms } from '$lib/server/cms';
import { saveDevAppointment } from '$lib/server/dev-store';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const cms = await loadLandingCms();
	try {
		const [dbServices, dbPackages, dbArticles] = await Promise.all([
			db.select().from(services).where(eq(services.isActive, true)),
			db.select().from(assessmentPackages).where(eq(assessmentPackages.isActive, true)),
			db
				.select()
				.from(articles)
				.where(eq(articles.isPublished, true))
				.orderBy(desc(articles.publishedAt), desc(articles.id))
		]);

		const mappedServices =
			dbServices.length > 0
				? dbServices.map((s) => ({
						id: s.id,
						slug: s.slug,
						name: s.name,
						categoryLabel: s.categoryLabel,
						durationMinutes: s.durationMinutes,
						description: s.description,
						highlights: Array.isArray(s.highlights) ? (s.highlights as string[]) : [],
						defaultComplaint:
							DEFAULT_SERVICES.find((d) => d.slug === s.slug)?.defaultComplaint ?? s.name
					}))
				: DEFAULT_SERVICES;

		const mappedPackages =
			dbPackages.length > 0
				? dbPackages.map((p) => ({
						id: p.id,
						slug: p.slug,
						name: p.name,
						priceIdr: p.priceIdr,
						observationMinutes: p.observationMinutes,
						dashboardFreeDays: p.dashboardFreeDays,
						features: Array.isArray(p.features) ? (p.features as string[]) : [],
						isRecommended: p.isRecommended
					}))
				: DEFAULT_PACKAGES;

		const mappedArticles: ArticleItem[] =
			dbArticles.length > 0
				? dbArticles.map((a) => ({
						id: a.id,
						slug: a.slug,
						title: a.title,
						abstract: a.abstract,
						content: a.content,
						imageUrl: a.imageUrl,
						authorName: a.authorName,
						tags: Array.isArray(a.tags) ? (a.tags as string[]) : [],
						viewCount: a.viewCount,
						isPublished: a.isPublished,
						publishedAt:
							a.publishedAt instanceof Date
								? a.publishedAt.toISOString()
								: String(a.publishedAt)
					}))
				: DEFAULT_ARTICLES;

		return {
			cms,
			services: mappedServices,
			packages: mappedPackages,
			articles: mappedArticles
		};
	} catch {
		return {
			cms,
			services: DEFAULT_SERVICES,
			packages: DEFAULT_PACKAGES,
			articles: DEFAULT_ARTICLES
		};
	}
};

export const actions: Actions = {
	book: async ({ request }) => {
		const formData = await request.formData();
		const parentName = String(formData.get('parentName') ?? '').trim();
		const childAgeLabel = String(formData.get('childAgeLabel') ?? '').trim();
		const mainComplaint = String(formData.get('mainComplaint') ?? '').trim();
		const rawWa = String(formData.get('parentWa') ?? '').trim();
		const serviceIdRaw = formData.get('serviceId');
		const packageIdRaw = formData.get('packageId');

		if (!parentName || !childAgeLabel || !mainComplaint || !rawWa) {
			return fail(400, {
				error: 'Mohon lengkapi seluruh kolom wajib sebelum mengirim reservasi.'
			});
		}

		const normalizedWa = normalizeWa(rawWa);
		const appointmentId = crypto.randomUUID();

		try {
			await db.insert(appointments).values({
				id: appointmentId,
				serviceId: serviceIdRaw ? Number(serviceIdRaw) : null,
				packageId: packageIdRaw ? Number(packageIdRaw) : null,
				parentName,
				parentWa: normalizedWa,
				childAgeLabel,
				mainComplaint,
				status: 'pending_wa',
				createdAt: new Date()
			});
		} catch (err) {
			console.warn('[Harapanku] DB offline saat menyimpan appointment, simpan ke dev-store:', err);
			if (process.env.NODE_ENV !== 'production') {
				saveDevAppointment({
					id: appointmentId,
					parentName,
					parentWa: normalizedWa,
					childAgeLabel,
					mainComplaint,
					scheduledAt: null,
					status: 'pending_wa',
					createdAt: new Date().toISOString()
				});
			}
		}

		const clinicWa = env.CLINIC_WA_NUMBER ?? '6285248282929';
		const message = [
			`Halo Care Coordinator Harapanku, saya ingin menjadwalkan Asesmen/Konsultasi:`,
			`- Nama Orang Tua: ${parentName}`,
			`- Usia Anak: ${childAgeLabel}`,
			`- Fokus/Keluhan: ${mainComplaint}`,
			`- No. WhatsApp: ${normalizedWa}`,
			`- Kode Ref: ${appointmentId.slice(0, 8).toUpperCase()}`
		].join('\n');

		const waUrl = `https://wa.me/${clinicWa}?text=${encodeURIComponent(message)}`;

		return {
			success: true,
			appointmentId,
			waUrl
		};
	}
};
