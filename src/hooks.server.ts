import { redirect, type Handle } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { SESSION_COOKIE, verifySessionToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Ensure guest visitors get an anonymous session token for TumbuhKembang.id
	let guestToken = event.cookies.get('tk_guest_token') ?? null;
	if (!guestToken) {
		guestToken = crypto.randomUUID();
		event.cookies.set('tk_guest_token', guestToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
	}
	event.locals.guestToken = guestToken;

	const sessionCookie = event.cookies.get(SESSION_COOKIE);
	const verified = verifySessionToken(sessionCookie);
	event.locals.user = verified
		? { id: verified.id, fullName: verified.fullName, role: verified.role }
		: null;

	const path = event.url.pathname;

	// RBAC guards for protected role areas
	if (path.startsWith('/parent') && event.locals.user?.role !== 'parent') {
		throw redirect(303, '/login');
	}
	if (
		path.startsWith('/clinic') &&
		!['therapist', 'psychologist'].includes(event.locals.user?.role ?? '')
	) {
		throw redirect(303, '/login');
	}
	if (path.startsWith('/admin') && event.locals.user?.role !== 'admin') {
		throw redirect(303, '/login');
	}

	return resolve(event);
};
