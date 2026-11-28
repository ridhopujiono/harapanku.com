import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { services } from '$lib/server/schema';
import { loadLandingCms, saveCmsSection } from '$lib/server/cms';
import { DEFAULT_SERVICES } from '$lib/data/defaults';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const cms = await loadLandingCms();
	try {
		const rows = await db.select().from(services).orderBy(asc(services.id));
		return {
			user: locals.user,
			header: cms.services_header,
			services: rows.map((r) => ({
				id: r.id,
				slug: r.slug,
				name: r.name,
				categoryLabel: r.categoryLabel,
				durationMinutes: r.durationMinutes,
				description: r.description,
				highlights: Array.isArray(r.highlights) ? (r.highlights as string[]) : [],
				isActive: r.isActive
			}))
		};
	} catch {
		return {
			user: locals.user,
			header: cms.services_header,
			services: DEFAULT_SERVICES.map((s) => ({ ...s, isActive: true }))
		};
	}
};

export const actions: Actions = {
	saveHeader: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		await saveCmsSection('services_header', { badge, title, subtitle });
		return { successMsg: 'Judul section Layanan Kami berhasil disimpan.' };
	},

	saveService: async ({ request }) => {
		const fd = await request.formData();
		const idRaw = String(fd.get('id') ?? '').trim();
		const name = String(fd.get('name') ?? '').trim();
		const slugInput = String(fd.get('slug') ?? '').trim();
		const categoryLabel = String(fd.get('categoryLabel') ?? '').trim();
		const durationMinutes = Number(fd.get('durationMinutes') ?? 60);
		const description = String(fd.get('description') ?? '').trim();
		const highlights = String(fd.get('highlights') ?? '')
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);
		const isActive = fd.get('isActive') === 'on';

		if (!name || !categoryLabel || !description) {
			return fail(400, { error: 'Nama layanan, kategori, dan deskripsi wajib diisi.' });
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
					.update(services)
					.set({ slug, name, categoryLabel, durationMinutes, description, highlights, isActive })
					.where(eq(services.id, Number(idRaw)));
				return { successMsg: `Layanan "${name}" berhasil diperbarui.` };
			} else {
				await db
					.insert(services)
					.values({ slug, name, categoryLabel, durationMinutes, description, highlights, isActive });
				return { successMsg: `Layanan baru "${name}" berhasil ditambahkan.` };
			}
		} catch (err) {
			return fail(500, {
				error: err instanceof Error ? err.message : 'Gagal menyimpan layanan ke MySQL.'
			});
		}
	},

	deleteService: async ({ request }) => {
		const fd = await request.formData();
		const id = Number(fd.get('id'));
		if (!id) return fail(400, { error: 'ID layanan tidak valid.' });

		try {
			await db.delete(services).where(eq(services.id, id));
			return { successMsg: 'Layanan berhasil dihapus.' };
		} catch (err) {
			return fail(500, {
				error: err instanceof Error ? err.message : 'Gagal menghapus layanan.'
			});
		}
	}
};
