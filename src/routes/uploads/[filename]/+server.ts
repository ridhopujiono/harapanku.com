import fs from 'node:fs';
import path from 'node:path';
import type { RequestHandler } from './$types';

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');

const MIME_MAP: Record<string, string> = {
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp'
};

export const GET: RequestHandler = async ({ params }) => {
	const safeName = path.basename(params.filename);
	const filePath = path.join(UPLOAD_DIR, safeName);

	if (!fs.existsSync(filePath)) {
		return new Response('Not found', { status: 404 });
	}

	const ext = path.extname(safeName).toLowerCase();
	const contentType = MIME_MAP[ext] ?? 'application/octet-stream';
	const bytes = fs.readFileSync(filePath);

	return new Response(bytes, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
