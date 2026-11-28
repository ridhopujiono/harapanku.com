import { error } from '@sveltejs/kit';
import { desc, eq, ne, and, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { articles } from '$lib/server/schema';
import { DEFAULT_ARTICLES, type ArticleItem } from '$lib/data/articles-defaults';
import { loadLandingCms } from '$lib/server/cms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const cms = await loadLandingCms();
	const slug = params.slug;

	try {
		const isAdmin = locals.user?.role === 'admin';
		const whereClause = isAdmin
			? eq(articles.slug, slug)
			: and(eq(articles.slug, slug), eq(articles.isPublished, true));

		const [row] = await db.select().from(articles).where(whereClause).limit(1);

		if (row) {
			await db
				.update(articles)
				.set({ viewCount: sql`${articles.viewCount} + 1` })
				.where(eq(articles.id, row.id));

			const relatedRows = await db
				.select()
				.from(articles)
				.where(and(eq(articles.isPublished, true), ne(articles.id, row.id)))
				.orderBy(desc(articles.publishedAt), desc(articles.id))
				.limit(3);

			const article: ArticleItem = {
				id: row.id,
				slug: row.slug,
				title: row.title,
				abstract: row.abstract,
				content: row.content,
				imageUrl: row.imageUrl,
				authorName: row.authorName,
				tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
				viewCount: row.viewCount + 1,
				isPublished: row.isPublished,
				publishedAt:
					row.publishedAt instanceof Date
						? row.publishedAt.toISOString()
						: String(row.publishedAt)
			};

			const relatedArticles: ArticleItem[] = relatedRows.map((r) => ({
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
					r.publishedAt instanceof Date
						? r.publishedAt.toISOString()
						: String(r.publishedAt)
			}));

			return { article, relatedArticles, cms };
		}

		// If DB is reachable but empty or slug truly doesn't exist, check if table has any rows
		const anyRows = await db.select({ id: articles.id }).from(articles).limit(1);
		if (anyRows.length > 0) {
			throw error(404, 'Artikel tidak ditemukan.');
		}
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		// Fallback to DEFAULT_ARTICLES when DB is offline
	}

	const fallback = DEFAULT_ARTICLES.find((a) => a.slug === slug);
	if (!fallback) {
		throw error(404, 'Artikel tidak ditemukan.');
	}

	return {
		article: { ...fallback, viewCount: fallback.viewCount + 1 },
		relatedArticles: DEFAULT_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3),
		cms
	};
};
