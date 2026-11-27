import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import {
	createSessionToken,
	normalizeWa,
	SESSION_COOKIE,
	verifyPassword,
	type UserRole
} from '$lib/server/auth';
import { findDevUserByWa } from '$lib/server/dev-store';
import type { Actions, PageServerLoad } from './$types';

function roleRedirectPath(role: UserRole): string {
	if (role === 'admin') return '/admin';
	if (role === 'psychologist' || role === 'therapist') return '/clinic';
	return '/parent';
}

const DEV_DEMO_ACCOUNTS: Array<{
	id: string;
	phoneWa: string;
	fullName: string;
	role: UserRole;
}> = [
	{ id: 'demo-admin-001', phoneWa: '628115400001', fullName: 'Admin Care Coordinator', role: 'admin' },
	{
		id: 'demo-psych-001',
		phoneWa: '628115400002',
		fullName: 'dr. Sarah Novita, S.Psi., Psikolog',
		role: 'psychologist'
	},
	{
		id: 'demo-therapist-001',
		phoneWa: '628115400003',
		fullName: 'Kak Budi Santoso, S.Tr.Kes',
		role: 'therapist'
	},
	{ id: 'demo-parent-001', phoneWa: '6282257802227', fullName: 'Bapak Ridho', role: 'parent' }
];

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, roleRedirectPath(locals.user.role));
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const rawWa = String(formData.get('phoneWa') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!rawWa || !password) {
			return fail(400, { error: 'Nomor WhatsApp dan kata sandi wajib diisi.' });
		}

		const phoneWa = normalizeWa(rawWa);
		let authenticated: { id: string; fullName: string; role: UserRole } | null = null;

		try {
			const [user] = await db.select().from(users).where(eq(users.phoneWa, phoneWa)).limit(1);
			if (user && user.isActive && user.passwordHash && verifyPassword(password, user.passwordHash)) {
				authenticated = {
					id: user.id,
					fullName: user.fullName,
					role: user.role
				};
			}
		} catch {
			// Fallback to dev-store & demo accounts in local preview if MySQL is not running yet
			if (process.env.NODE_ENV !== 'production') {
				const devUser = findDevUserByWa(phoneWa);
				if (devUser && verifyPassword(password, devUser.passwordHash)) {
					authenticated = {
						id: devUser.id,
						fullName: devUser.fullName,
						role: devUser.role
					};
				} else if (password === 'harapanku123') {
					const demo = DEV_DEMO_ACCOUNTS.find((a) => a.phoneWa === phoneWa);
					if (demo) {
						authenticated = { id: demo.id, fullName: demo.fullName, role: demo.role };
					}
				}
			}
		}

		if (!authenticated) {
			return fail(401, {
				error: 'Nomor WhatsApp atau kata sandi salah. Pastikan akun Anda sudah diaktifkan oleh Admin.'
			});
		}

		const token = createSessionToken(authenticated);
		cookies.set(SESSION_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, roleRedirectPath(authenticated.role));
	}
};
