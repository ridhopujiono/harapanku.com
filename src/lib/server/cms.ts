import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { db } from './db';
import { cmsSections } from './schema';
import { DEFAULT_CMS, type LandingCmsData } from '$lib/data/cms-defaults';

const DEV_CMS_PATH = path.resolve('.svelte-kit/dev-cms-store.json');
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');

function readDevCms(): Partial<LandingCmsData> {
	try {
		if (fs.existsSync(DEV_CMS_PATH)) {
			return JSON.parse(fs.readFileSync(DEV_CMS_PATH, 'utf8')) as Partial<LandingCmsData>;
		}
	} catch {
		// ignore corrupt dev file
	}
	return {};
}

function writeDevCms(key: keyof LandingCmsData, content: unknown) {
	try {
		const current = readDevCms();
		const updated = { ...current, [key]: content };
		fs.mkdirSync(path.dirname(DEV_CMS_PATH), { recursive: true });
		fs.writeFileSync(DEV_CMS_PATH, JSON.stringify(updated, null, 2), 'utf8');
	} catch {
		// ignore write errors
	}
}

export async function loadLandingCms(): Promise<LandingCmsData> {
	const merged: LandingCmsData = structuredClone(DEFAULT_CMS);

	try {
		const rows = await db.select().from(cmsSections);
		for (const row of rows) {
			const key = row.sectionKey as keyof LandingCmsData;
			if (key in merged && row.content && typeof row.content === 'object') {
				(merged[key] as unknown) = {
					...merged[key],
					...(row.content as Record<string, unknown>)
				};
			}
		}
		return merged;
	} catch {
		if (process.env.NODE_ENV !== 'production') {
			const dev = readDevCms();
			for (const [k, val] of Object.entries(dev)) {
				const key = k as keyof LandingCmsData;
				if (key in merged && val && typeof val === 'object') {
					(merged[key] as unknown) = {
						...merged[key],
						...(val as unknown as Record<string, unknown>)
					};
				}
			}
		}
		return merged;
	}
}

export async function saveCmsSection<K extends keyof LandingCmsData>(
	key: K,
	content: LandingCmsData[K]
): Promise<void> {
	const now = new Date();
	try {
		await db
			.insert(cmsSections)
			.values({
				sectionKey: key,
				content,
				updatedAt: now
			})
			.onDuplicateKeyUpdate({
				set: {
					content,
					updatedAt: now
				}
			});
	} catch (err) {
		console.warn(`[CMS] DB offline saat menyimpan ${key}, simpan ke dev-cms-store:`, err);
		if (process.env.NODE_ENV !== 'production') {
			writeDevCms(key, content);
		} else {
			throw err;
		}
	}
}

export async function saveUploadedImage(file: File | null): Promise<string | null> {
	if (!file || file.size === 0) return null;

	const allowedTypes: Record<string, string> = {
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/webp': 'webp'
	};
	const ext = allowedTypes[file.type];
	if (!ext) {
		throw new Error('Format gambar harus PNG, JPG, atau WEBP.');
	}
	if (file.size > 5 * 1024 * 1024) {
		throw new Error('Ukuran gambar maksimal 5 MB.');
	}

	const filename = `${crypto.randomUUID()}.${ext}`;
	fs.mkdirSync(UPLOAD_DIR, { recursive: true });
	const buf = Buffer.from(await file.arrayBuffer());
	fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);

	return `/uploads/${filename}`;
}
