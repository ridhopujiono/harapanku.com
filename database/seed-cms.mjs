import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

const connectionUrl =
	process.env.DATABASE_URL ??
	'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku';

// Read DEFAULT_CMS values directly from defaults file or mirror cleanly
const defaultsFile = fs.readFileSync(
	path.resolve('src/lib/data/cms-defaults.ts'),
	'utf8'
);
const match = defaultsFile.match(/export const DEFAULT_CMS:\s*LandingCmsData\s*=\s*(\{[\s\S]*\});/);
if (!match) {
	console.error('Could not parse DEFAULT_CMS from src/lib/data/cms-defaults.ts');
	process.exit(1);
}

// Evaluate object literal safely in isolated Function scope
const defaultCms = new Function(`return (${match[1]})`)();

async function main() {
	const conn = await mysql.createConnection(connectionUrl);

	await conn.execute(`
		CREATE TABLE IF NOT EXISTS cms_sections (
			section_key VARCHAR(50) NOT NULL PRIMARY KEY,
			content JSON NOT NULL,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	`);

	for (const [key, content] of Object.entries(defaultCms)) {
		await conn.execute(
			`INSERT IGNORE INTO cms_sections (section_key, content) VALUES (?, ?)`,
			[key, JSON.stringify(content)]
		);
	}

	const [rows] = await conn.execute('SELECT section_key, updated_at FROM cms_sections ORDER BY section_key');
	console.log('Seeded CMS sections in MySQL:', rows);
	await conn.end();
}

main().catch((err) => {
	console.error('Failed to seed CMS:', err.message);
	process.exit(1);
});
