import { fail } from '@sveltejs/kit';
import { loadLandingCms, saveCmsSection, saveUploadedImage } from '$lib/server/cms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const cms = await loadLandingCms();
	return {
		user: locals.user,
		hero: cms.hero,
		footer: cms.footer
	};
};

export const actions: Actions = {
	saveHero: async ({ request }) => {
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		const subtitle = String(formData.get('subtitle') ?? '').trim();
		const badge = String(formData.get('badge') ?? '').trim();
		const ctaPrimary = String(formData.get('ctaPrimary') ?? '').trim();
		const ctaSecondary = String(formData.get('ctaSecondary') ?? '').trim();
		const ratingScore = String(formData.get('ratingScore') ?? '').trim();
		const ratingLabel = String(formData.get('ratingLabel') ?? '').trim();
		const slotBadge = String(formData.get('slotBadge') ?? '').trim();
		const trustBadgesRaw = String(formData.get('trustBadges') ?? '');
		let imageUrl = String(formData.get('imageUrl') ?? '').trim();

		if (!title || !subtitle) {
			return fail(400, { error: 'Judul dan Subjudul Hero wajib diisi.' });
		}

		const imageFile = formData.get('imageFile');
		if (imageFile instanceof File && imageFile.size > 0) {
			try {
				const uploaded = await saveUploadedImage(imageFile);
				if (uploaded) imageUrl = uploaded;
			} catch (err) {
				return fail(400, {
					error: err instanceof Error ? err.message : 'Gagal mengunggah gambar.'
				});
			}
		}

		const trustBadges = trustBadgesRaw
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean);

		await saveCmsSection('hero', {
			badge,
			title,
			subtitle,
			imageUrl: imageUrl || '/assets/images/hero-clinic-care.png',
			ctaPrimary,
			ctaSecondary,
			ratingScore,
			ratingLabel,
			slotBadge,
			trustBadges
		});

		return { successHero: true };
	},

	saveFooter: async ({ request }) => {
		const formData = await request.formData();
		const description = String(formData.get('description') ?? '').trim();
		const whatsappDisplay = String(formData.get('whatsappDisplay') ?? '').trim();
		const address = String(formData.get('address') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const hoursWeekday = String(formData.get('hoursWeekday') ?? '').trim();
		const hoursSunday = String(formData.get('hoursSunday') ?? '').trim();
		const copyright = String(formData.get('copyright') ?? '').trim();

		await saveCmsSection('footer', {
			description,
			whatsappDisplay,
			address,
			phone,
			hoursWeekday,
			hoursSunday,
			copyright
		});

		return { successFooter: true };
	}
};
