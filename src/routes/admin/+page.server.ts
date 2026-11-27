import { fail } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { appointments, assessmentPackages, therapists, users } from '$lib/server/schema';
import { generateTempPassword, hashPassword, normalizeWa } from '$lib/server/auth';
import {
	getDevAppointments,
	saveDevUser,
	updateDevAppointmentStatus
} from '$lib/server/dev-store';
import { DEFAULT_PACKAGES } from '$lib/data/defaults';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const [appts, staffRows, pkgRows] = await Promise.all([
			db.select().from(appointments).orderBy(desc(appointments.createdAt)),
			db
				.select({
					id: therapists.id,
					fullName: users.fullName,
					specialization: therapists.specialization
				})
				.from(therapists)
				.innerJoin(users, eq(therapists.userId, users.id))
				.where(eq(therapists.isActive, true)),
			db.select().from(assessmentPackages).where(eq(assessmentPackages.isActive, true))
		]);

		return {
			user: locals.user,
			appointments: appts,
			therapists: staffRows,
			packages: pkgRows.length > 0 ? pkgRows : DEFAULT_PACKAGES
		};
	} catch {
		const devAppts = getDevAppointments().map((a) => ({
			...a,
			childId: null,
			serviceId: null,
			packageId: null,
			therapistId: null,
			scheduledAt: a.scheduledAt ? new Date(a.scheduledAt) : null,
			adminNotes: null,
			createdAt: new Date(a.createdAt)
		}));

		const fallbackList =
			devAppts.length > 0
				? devAppts
				: [
						{
							id: 'fe621562-0000-4000-8000-000000000001',
							childId: null,
							serviceId: 2,
							packageId: null,
							therapistId: null,
							parentName: 'Ridho',
							parentWa: '6282257802227',
							childAgeLabel: '2 Tahun 10 Bulan',
							mainComplaint: 'Tantrum & Fokus Perilaku (ABA)',
							scheduledAt: null,
							status: 'pending_wa' as const,
							adminNotes: null,
							createdAt: new Date()
						}
					];

		return {
			user: locals.user,
			appointments: fallbackList,
			therapists: [
				{
					id: 'demo-psych-id',
					fullName: 'dr. Sarah Novita, S.Psi., Psikolog',
					specialization: 'Psychologist' as const
				},
				{
					id: 'demo-therapist-id',
					fullName: 'Kak Budi Santoso, S.Tr.Kes',
					specialization: 'ABA' as const
				}
			],
			packages: DEFAULT_PACKAGES
		};
	}
};

export const actions: Actions = {
	confirmAndCreateAccount: async ({ request }) => {
		const formData = await request.formData();
		const appointmentId = String(formData.get('appointmentId') ?? '');
		const parentName = String(formData.get('parentName') ?? '').trim();
		const parentWaRaw = String(formData.get('parentWa') ?? '').trim();
		const scheduledAtStr = String(formData.get('scheduledAt') ?? '').trim();
		const therapistId = String(formData.get('therapistId') ?? '').trim() || null;
		const packageIdRaw = String(formData.get('packageId') ?? '').trim();
		const adminNotes = String(formData.get('adminNotes') ?? '').trim() || null;

		if (!appointmentId || !scheduledAtStr) {
			return fail(400, { error: 'Jadwal tanggal & jam asesmen wajib diisi.' });
		}

		const parentWa = normalizeWa(parentWaRaw);
		const tempPassword = generateTempPassword();
		let accountCreated = false;

		try {
			await db
				.update(appointments)
				.set({
					status: 'confirmed',
					scheduledAt: new Date(scheduledAtStr),
					therapistId,
					packageId: packageIdRaw ? Number(packageIdRaw) : null,
					adminNotes
				})
				.where(eq(appointments.id, appointmentId));

			const [existingUser] = await db
				.select()
				.from(users)
				.where(eq(users.phoneWa, parentWa))
				.limit(1);

			if (!existingUser) {
				const now = new Date();
				await db.insert(users).values({
					id: crypto.randomUUID(),
					fullName: parentName || 'Orang Tua Harapanku',
					phoneWa: parentWa,
					passwordHash: hashPassword(tempPassword),
					role: 'parent',
					isActive: true,
					createdAt: now,
					updatedAt: now
				});
				accountCreated = true;
			}
		} catch (err) {
			console.warn('[Admin] DB offline saat konfirmasi, simpan ke dev-store:', err);
			if (process.env.NODE_ENV !== 'production') {
				updateDevAppointmentStatus(appointmentId, 'confirmed', scheduledAtStr);
				saveDevUser({
					id: crypto.randomUUID(),
					fullName: parentName || 'Orang Tua Harapanku',
					phoneWa: parentWa,
					passwordHash: hashPassword(tempPassword),
					role: 'parent'
				});
			}
			accountCreated = true;
		}

		const origin = env.ORIGIN ?? 'https://harapanku.id';
		const formattedDate = new Date(scheduledAtStr).toLocaleString('id-ID', {
			dateStyle: 'full',
			timeStyle: 'short'
		});

		const waLines = [
			`Halo Ayah/Bunda ${parentName}, jadwal Asesmen Awal di *Klinik Harapanku* sudah *TERKONFIRMASI* (Zero Waiting List):`,
			`- Jadwal: ${formattedDate} WITA`,
			`- Kode Ref: ${appointmentId.slice(0, 8).toUpperCase()}`,
			``,
			`Berikut akses *Parent Dashboard* Anda:`,
			`- Link Login: ${origin}/login`,
			`- No. WhatsApp: ${parentWa}`,
			accountCreated
				? `- Kata Sandi Sementara: *${tempPassword}*`
				: `- Kata Sandi: Gunakan kata sandi akun Anda sebelumnya`
		];

		const waConfirmUrl = `https://wa.me/${parentWa}?text=${encodeURIComponent(waLines.join('\n'))}`;

		return {
			success: true,
			appointmentId,
			parentName,
			tempPassword: accountCreated ? tempPassword : null,
			waConfirmUrl
		};
	}
};
