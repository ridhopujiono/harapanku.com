import crypto from 'node:crypto';
import mysql from 'mysql2/promise';

function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const derived = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${derived}`;
}

const connectionUrl =
	process.env.DATABASE_URL ??
	'mysql://harapanku_app:harapanku_app_secret@127.0.0.1:3306/harapanku';

const staffAccounts = [
	{
		id: '11111111-1111-4111-8111-111111111101',
		fullName: 'Admin Care Coordinator',
		email: 'admin@harapanku.id',
		phoneWa: '628115400001',
		role: 'admin',
		therapist: null
	},
	{
		id: '11111111-1111-4111-8111-111111111102',
		fullName: 'dr. Sarah Novita, S.Psi., Psikolog',
		email: 'sarah@harapanku.id',
		phoneWa: '628115400002',
		role: 'psychologist',
		therapist: {
			id: '22222222-2222-4222-8222-222222222202',
			strNumber: 'STR-HIMPSI-2025-001',
			licenseOrg: 'HIMPSI',
			specialization: 'Psychologist',
			bio: 'Psikolog Klinis Anak dengan fokus asesmen tumbuh kembang dan roadmap terapi.'
		}
	},
	{
		id: '11111111-1111-4111-8111-111111111103',
		fullName: 'Kak Budi Santoso, S.Tr.Kes',
		email: 'budi@harapanku.id',
		phoneWa: '628115400003',
		role: 'therapist',
		therapist: {
			id: '22222222-2222-4222-8222-222222222203',
			strNumber: 'STR-KEMENKES-2025-002',
			licenseOrg: 'Kemenkes',
			specialization: 'ABA',
			bio: 'Terapis Perilaku (ABA) dan Okupasi bersertifikat STR Kemenkes.'
		}
	}
];

async function main() {
	const conn = await mysql.createConnection(connectionUrl);
	const defaultPasswordHash = hashPassword('harapanku123');

	for (const staff of staffAccounts) {
		await conn.execute(
			`INSERT INTO users (id, full_name, email, phone_wa, password_hash, role, is_active)
			 VALUES (?, ?, ?, ?, ?, ?, TRUE)
			 ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), role = VALUES(role)`,
			[staff.id, staff.fullName, staff.email, staff.phoneWa, defaultPasswordHash, staff.role]
		);

		if (staff.therapist) {
			await conn.execute(
				`INSERT INTO therapists (id, user_id, str_number, license_org, specialization, bio, is_active)
				 VALUES (?, ?, ?, ?, ?, ?, TRUE)
				 ON DUPLICATE KEY UPDATE str_number = VALUES(str_number), specialization = VALUES(specialization)`,
				[
					staff.therapist.id,
					staff.id,
					staff.therapist.strNumber,
					staff.therapist.licenseOrg,
					staff.therapist.specialization,
					staff.therapist.bio
				]
			);
		}
	}

	const [rows] = await conn.execute('SELECT full_name, phone_wa, role FROM users ORDER BY role');
	console.log('Seeded users in MySQL:', rows);
	await conn.end();
}

main().catch((err) => {
	console.error('Failed to seed staff:', err.message);
	process.exit(1);
});
