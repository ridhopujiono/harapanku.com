import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { assessmentPackages } from '$lib/server/schema';
import { loadLandingCms, saveCmsSection } from '$lib/server/cms';
import { DEFAULT_PACKAGES } from '$lib/data/defaults';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const cms = await loadLandingCms();
	try {
		const rows = await db.select().from(assessmentPackages).orderBy(asc(assessmentPackages.id));
		return {
			user: locals.user,
			investment: cms.investment,
			packages: rows.map((p) => ({
				id: p.id,
				slug: p.slug,
				name: p.name,
				priceIdr: p.priceIdr,
				observationMinutes: p.observationMinutes,
				dashboardFreeDays: p.dashboardFreeDays,
				features: Array.isArray(p.features) ? (p.features as string[]) : [],
				isRecommended: p.isRecommended,
				isActive: p.isActive
			}))
		};
	} catch {
		return {
			user: locals.user,
			investment: cms.investment,
			packages: DEFAULT_PACKAGES.map((p) => ({ ...p, isActive: true }))
		};
	}
};

export const actions: Actions = {
	saveInvestment: async ({ request }) => {
		const fd = await request.formData();
		await saveCmsSection('investment', {
			badge: String(fd.get('badge') ?? '').trim(),
			title: String(fd.get('title') ?? '').trim(),
			subtitle: String(fd.get('subtitle') ?? '').trim(),
			calloutTitle: String(fd.get('calloutTitle') ?? '').trim(),
			calloutBadge: String(fd.get('calloutBadge') ?? '').trim(),
			calloutDescription: String(fd.get('calloutDescription') ?? '').trim(),
			calloutButton: String(fd.get('calloutButton') ?? '').trim()
		});
		return { successMsg: 'Section Investasi & Banner Skrining berhasil disimpan.' };
	},

	savePackage: async ({ request }) => {
		const fd = await request.formData();
		const idRaw = String(fd.get('id') ?? '').trim();
		const name = String(fd.get('name') ?? '').trim();
		const slugInput = String(fd.get('slug') ?? '').trim();
		const priceIdr = Number(fd.get('priceIdr') ?? 0);
		const observationMinutes = Number(fd.get('observationMinutes') ?? 45);
		const dashboardFreeDays = Number(fd.get('dashboardFreeDays') ?? 0);
		const features = String(fd.get('features') ?? '')
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		const isRecommended = fd.get('isRecommended') === 'on';
		const isActive = fd.get('isActive') === 'on';

		if (!name || priceIdr < 0) {
			return fail(400, { error: 'Nama paket dan harga wajib valid.' });
		}

		const slug =
			slugInput ||
			name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');

		try {
			if (idRaw) {
				await db
					.update(assessmentPackages)
					.set({
						slug,
						name,
						priceIdr,
						observationMinutes,
						dashboardFreeDays,
						features,
						isRecommended,
						isActive
					})
					.where(eq(assessmentPackages.id, Number(idRaw)));
				return { successMsg: `Paket "${name}" berhasil diperbarui.` };
			} else {
				await db.insert(assessmentPackages).values({
					slug,
					name,
					priceIdr,
					observationMinutes,
					dashboardFreeDays,
					features,
					isRecommended,
					isActive
				});
				return { successMsg: `Paket baru "${name}" berhasil ditambahkan.` };
			}
		} catch (err) {
			return fail(500, {
				error: err instanceof Error ? err.message : 'Gagal menyimpan paket ke MySQL.'
			});
		}
	},

	deletePackage: async ({ request }) => {
		const fd = await request.formData();
		const id = Number(fd.get('id'));
		if (!id) return fail(400, { error: 'ID paket tidak valid.' });

		try {
			await db.delete(assessmentPackages).where(eq(assessmentPackages.id, id));
			return { successMsg: 'Paket berhasil dihapus.' };
		} catch (err) {
			return fail(500, {
				error: err instanceof Error ? err.message : 'Gagal menghapus paket.'
			});
		}
	}
};
