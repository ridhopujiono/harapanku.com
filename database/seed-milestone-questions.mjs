import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

const connectionUrl =
	process.env.DATABASE_URL ??
	'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku';

const tsSource = fs.readFileSync(
	path.resolve('src/lib/data/milestone-screening.ts'),
	'utf8'
);

const rawMatch = tsSource.match(/const RAW_MILESTONE_DATA:\s*RawTuple\[\]\s*=\s*(\[[\s\S]*?\n\]);/);
if (!rawMatch) {
	console.error('Could not parse RAW_MILESTONE_DATA');
	process.exit(1);
}

const rawRows = new Function(`return (${rawMatch[1]})`)();

const ASPECT_META = {
	motorik_kasar: {
		pillar: 'okupasi',
		guide: 'Minta anak melakukan gerakan dengan aman; beri contoh bila perlu.'
	},
	motorik_halus: {
		pillar: 'okupasi',
		guide: 'Sediakan balok, kertas, krayon, buku, bola kecil atau wadah sesuai usia.'
	},
	bahasa_komunikasi: {
		pillar: 'wicara',
		guide: 'Tanyakan kepada orang tua dan ajak anak berkomunikasi langsung.'
	},
	sosialisasi_kemandirian: {
		pillar: 'perilaku',
		guide: 'Amati saat bermain, makan, berpakaian, dan berinteraksi.'
	}
};

const ASPECT_CODE = {
	motorik_kasar: 'MK',
	motorik_halus: 'MH',
	bahasa_komunikasi: 'BK',
	sosialisasi_kemandirian: 'SK'
};

async function safeAlter(conn, sql) {
	try {
		await conn.execute(sql);
	} catch {
		// column already exists
	}
}

async function main() {
	const conn = await mysql.createConnection(connectionUrl);

	await safeAlter(conn, 'ALTER TABLE screening_questions MODIFY source_standard VARCHAR(50) NOT NULL');
	await safeAlter(conn, 'ALTER TABLE screening_questions ADD COLUMN age_group_months SMALLINT UNSIGNED NULL');
	await safeAlter(conn, 'ALTER TABLE screening_questions ADD COLUMN aspect VARCHAR(40) NULL');
	await safeAlter(conn, "ALTER TABLE screening_answers ADD COLUMN answer_choice ENUM('ya', 'tidak', 'belum_dinilai') NULL");
	await safeAlter(conn, 'ALTER TABLE screening_answers ADD COLUMN notes TEXT NULL');

	for (let i = 0; i < rawRows.length; i++) {
		const [ageGroup, aspect, qNum, questionText] = rawRows[i];
		const code = `MS_${ageGroup}M_${ASPECT_CODE[aspect]}_0${qNum}`;
		const meta = ASPECT_META[aspect];

		await conn.execute(
			`INSERT INTO screening_questions
			 (code, source_standard, pillar, age_group_months, aspect, min_age_months, max_age_months, question_template, home_example, is_critical_indicator, sort_order, is_active)
			 VALUES (?, 'Buku KIA 2024 / SDIDTK 2022', ?, ?, ?, ?, ?, ?, ?, FALSE, ?, TRUE)
			 ON DUPLICATE KEY UPDATE
			   question_template = VALUES(question_template),
			   home_example = VALUES(home_example),
			   age_group_months = VALUES(age_group_months),
			   aspect = VALUES(aspect),
			   sort_order = VALUES(sort_order)`,
			[code, meta.pillar, ageGroup, aspect, ageGroup, ageGroup + 6, questionText, meta.guide, i + 1]
		);
	}

	const [countRows] = await conn.execute(
		'SELECT COUNT(*) AS total FROM screening_questions WHERE age_group_months IS NOT NULL'
	);
	console.log('Seeded milestone screening questions in MySQL:', countRows[0]);
	await conn.end();
}

main().catch((err) => {
	console.error('Failed to seed milestone questions:', err.message);
	process.exit(1);
});
