import { fail } from '@sveltejs/kit';
import { loadLandingCms, saveCmsSection, saveUploadedImage } from '$lib/server/cms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const cms = await loadLandingCms();
	return {
		user: locals.user,
		advantages: cms.advantages,
		flow: cms.flow,
		transparency: cms.transparency,
		facilities: cms.facilities,
		faq: cms.faq
	};
};

export const actions: Actions = {
	saveAdvantages: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		const itemsJson = String(fd.get('itemsJson') ?? '[]');

		try {
			const items = JSON.parse(itemsJson);
			await saveCmsSection('advantages', { badge, title, subtitle, items });
			return { successSection: 'advantages' };
		} catch {
			return fail(400, { error: 'Gagal menyimpan Keunggulan Harapanku.' });
		}
	},

	saveFlow: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		const footerNote = String(fd.get('footerNote') ?? '').trim();
		const stepsJson = String(fd.get('stepsJson') ?? '[]');

		try {
			const steps = JSON.parse(stepsJson);
			await saveCmsSection('flow', { badge, title, subtitle, footerNote, steps });
			return { successSection: 'flow' };
		} catch {
			return fail(400, { error: 'Gagal menyimpan Alur Terapi Kami.' });
		}
	},

	saveTransparency: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		const ctaLabel = String(fd.get('ctaLabel') ?? '').trim();
		const highlights = String(fd.get('highlights') ?? '')
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		await saveCmsSection('transparency', { badge, title, subtitle, ctaLabel, highlights });
		return { successSection: 'transparency' };
	},

	saveFacilities: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		const itemsJson = String(fd.get('itemsJson') ?? '[]');

		try {
			const items = JSON.parse(itemsJson) as Array<{
				tag: string;
				title: string;
				description: string;
				footerLabel: string;
				imageUrl: string;
			}>;

			for (let i = 0; i < items.length; i++) {
				const file = fd.get(`facilityFile_${i}`);
				if (file instanceof File && file.size > 0) {
					const uploaded = await saveUploadedImage(file);
					if (uploaded) items[i].imageUrl = uploaded;
				}
			}

			await saveCmsSection('facilities', { badge, title, subtitle, items });
			return { successSection: 'facilities' };
		} catch (err) {
			return fail(400, {
				error: err instanceof Error ? err.message : 'Gagal menyimpan Fasilitas Klinik.'
			});
		}
	},

	saveFaq: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		const helpTitle = String(fd.get('helpTitle') ?? '').trim();
		const helpSubtitle = String(fd.get('helpSubtitle') ?? '').trim();
		const itemsJson = String(fd.get('itemsJson') ?? '[]');

		try {
			const items = JSON.parse(itemsJson);
			await saveCmsSection('faq', {
				badge,
				title,
				subtitle,
				helpTitle,
				helpSubtitle,
				items
			});
			return { successSection: 'faq' };
		} catch {
			return fail(400, { error: 'Gagal menyimpan Bantuan & Informasi (FAQ).' });
		}
	}
};
