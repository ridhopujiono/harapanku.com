import crypto from 'node:crypto';
import { env } from '$env/dynamic/private';

export type UserRole = 'parent' | 'therapist' | 'psychologist' | 'admin';

export interface SessionPayload {
	id: string;
	fullName: string;
	role: UserRole;
	exp: number;
}

const SESSION_COOKIE = 'harapanku_session';

function getSecret(): string {
	return env.SESSION_SECRET ?? 'harapanku_dev_secret_change_in_production';
}

export function normalizeWa(raw: string): string {
	const digits = raw.replace(/\D/g, '');
	if (digits.startsWith('0')) {
		return '62' + digits.slice(1);
	}
	if (digits.startsWith('8')) {
		return '62' + digits;
	}
	return digits;
}

export function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString('hex');
	const derived = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
	const [salt, keyHex] = storedHash.split(':');
	if (!salt || !keyHex) return false;
	const derived = crypto.scryptSync(password, salt, 64);
	const keyBuf = Buffer.from(keyHex, 'hex');
	if (derived.length !== keyBuf.length) return false;
	return crypto.timingSafeEqual(derived, keyBuf);
}

export function createSessionToken(user: Omit<SessionPayload, 'exp'>): string {
	const payload: SessionPayload = {
		...user,
		exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
	};
	const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
	const sig = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
	return `${data}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
	if (!token) return null;
	const [data, sig] = token.split('.');
	if (!data || !sig) return null;

	const expectedSig = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
	const sigBuf = Buffer.from(sig);
	const expectedBuf = Buffer.from(expectedSig);
	if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
		return null;
	}

	try {
		const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
		if (!parsed.exp || parsed.exp < Date.now()) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function generateTempPassword(): string {
	const num = crypto.randomInt(1000, 9999);
	return `HRPK-${num}`;
}

export { SESSION_COOKIE };
