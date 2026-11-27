import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const appEnv = (env.APP_ENV ?? 'development').toLowerCase();
	const launchAt = env.LAUNCH_AT ?? '2026-11-30T00:00:00+08:00';
	const launchTime = new Date(launchAt).getTime();

	const isCountdownMode =
		appEnv === 'production' && !Number.isNaN(launchTime) && Date.now() < launchTime;

	return {
		isCountdownMode,
		launchAt
	};
};
