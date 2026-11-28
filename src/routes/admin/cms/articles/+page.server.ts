import { fail } from '@sveltejs/kit';
import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { articles } from '$lib/server/schema';
import { loadLandingCms, saveCmsSection, saveUploadedImage } from '$lib/server/cms';
import { DEFAULT_ARTICLES, type ArticleItem } from '$lib/data/articles-defaults';
import type { Actions, PageServerLoad } from './$types';

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function parseTags(raw: string): string[] {
	return raw
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
}

export const load: PageServerLoad = async ({ locals }) => {
	const cms = await loadLandingCms();
	try {
		const rows = await db
			.select()
			.from(articles)
			.orderBy(desc(articles.publishedAt), desc(articles.id));

		const mapped: ArticleItem[] = rows.map((r) => ({
			id: r.id,
			slug: r.slug,
			title: r.title,
			abstract: r.abstract,
			content: r.content,
			imageUrl: r.imageUrl,
			authorName: r.authorName,
			tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
			viewCount: r.viewCount,
			isPublished: r.isPublished,
			publishedAt:
				r.publishedAt instanceof Date ? r.publishedAt.toISOString() : String(r.publishedAt)
		}));

		return {
			user: locals.user,
			header: cms.articles_header,
			articles: mapped
		};
	} catch {
		return {
			user: locals.user,
			header: cms.articles_header,
			articles: DEFAULT_ARTICLES
		};
	}
};

export const actions: Actions = {
	saveHeader: async ({ request }) => {
		const fd = await request.formData();
		const badge = String(fd.get('badge') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const subtitle = String(fd.get('subtitle') ?? '').trim();
		await saveCmsSection('articles_header', { badge, title, subtitle });
		return { successMsg: 'Judul section Articles berhasil disimpan.' };
	},

	saveArticle: async ({ request }) => {
		const fd = await request.formData();
		const idRaw = String(fd.get('id') ?? '').trim();
		const title = String(fd.get('title') ?? '').trim();
		const slugInput = String(fd.get('slug') ?? '').trim();
		const authorName = String(fd.get('authorName') ?? '').trim();
		const abstract = String(fd.get('abstract') ?? '').trim();
		const content = String(fd.get('content') ?? '').trim();
		const tags = parseTags(String(fd.get('tags') ?? ''));
		const isPublished = fd.get('isPublished') === 'on';
		const publishedAtRaw = String(fd.get('publishedAt') ?? '').trim();
		const fallbackImageUrl = String(fd.get('imageUrl') ?? '').trim() || '/assets/images/article-1.svg';

		if (!title || !authorName || !abstract || !content) {
			return fail(400, {
				error: 'Judul, penulis, abstrak, dan isi artikel wajib diisi.'
			});
		}

		const slug = slugify(slugInput || title);
		if (!slug) {
			return fail(400, { error: 'Slug artikel tidak valid.' });
		}

		const uploadedFile = fd.get('imageFile');
		const uploadedPath =
			uploadedFile instanceof File && uploadedFile.size > 0
				? await saveUploadedImage(uploadedFile)
				: null;
		const imageUrl = uploadedPath || fallbackImageUrl;

		const parsedDate = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
		const publishedAt = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
		const now = new Date();

		try {
			if (idRaw) {
				const articleId = Number(idRaw);
				const duplicate = await db
					.select({ id: articles.id })
					.from(articles)
					.where(and(eq(articles.slug, slug), ne(articles.id, articleId)))
					.limit(1);

				if (duplicate.length > 0) {
					return fail(400, {
						error: `Slug "${slug}" sudah dipakai artikel lain. Gunakan slug yang berbeda.`
					});
				}

				await db
					.update(articles)
					.set({
						slug,
						title,
						abstract,
						content,
						imageUrl,
						authorName,
						tags,
						isPublished,
						publishedAt,
						updatedAt: now
					})
					.where(eq(articles.id, articleId));

				return { successMsg: `Artikel "${title}" berhasil diperbarui.` };
			} else {
				const duplicate = await db
					.select({ id: articles.id })
					.from(articles)
					.where(eq(articles.slug, slug))
					.limit(1);

				const finalSlug =
					duplicate.length > 0 ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

				await db.insert(articles).values({
					slug: finalSlug,
					title,
					abstract,
					content,
					imageUrl,
					authorName,
					tags,
					viewCount: 0,
					isPublished,
					publishedAt,
					createdAt: now,
					updatedAt: now
				});

				return { successMsg: `Artikel baru "${title}" berhasil diterbitkan.` };
			}
		} catch (err) {
			console.error('[CMS Articles] Save error:', err);
			return fail(500, { error: 'Gagal menyimpan artikel ke database.' });
		}
	},

	deleteArticle: async ({ request }) => {
		const fd = await request.formData();
		const id = Number(fd.get('id'));
		if (!id) {
			return fail(400, { error: 'ID artikel tidak valid.' });
		}
		try {
			await db.delete(articles).where(eq(articles.id, id));
			return { successMsg: 'Artikel berhasil dihapus.' };
		} catch (err) {
			console.error('[CMS Articles] Delete error:', err);
			return fail(500, { error: 'Gagal menghapus artikel dari database.' });
		}
	}
};
