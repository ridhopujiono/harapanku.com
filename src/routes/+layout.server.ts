import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

const INTERNAL_BYPASS_PREFIXES = ['/login', '/logout', '/admin', '/clinic', '/parent'];

export const load: LayoutServerLoad = async ({ url }) => {
	const appEnv = (env.APP_ENV ?? 'development').toLowerCase();
	const launchAt = env.LAUNCH_AT ?? '2026-11-30T00:00:00+08:00';
	const launchTime = new Date(launchAt).getTime();

	const isInternalRoute = INTERNAL_BYPASS_PREFIXES.some((p) => url.pathname.startsWith(p));

	const isCountdownMode =
		!isInternalRoute &&
		appEnv === 'production' &&
		!Number.isNaN(launchTime) &&
		Date.now() < launchTime;

	return {
		isCountdownMode,
		launchAt
	};
};
