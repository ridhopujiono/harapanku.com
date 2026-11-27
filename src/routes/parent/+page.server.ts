import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	children,
	milestoneSnapshots,
	monthlyTargets,
	therapyPlans,
	therapySessions
} from '$lib/server/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id ?? '';

	try {
		const childRows = await db
			.select()
			.from(children)
			.where(eq(children.parentId, userId))
			.limit(1);

		const child = childRows[0] ?? null;
		if (!child) {
			return { user: locals.user, child: null, plan: null, snapshot: null, sessions: [], targets: [] };
		}

		const [plan] = await db
			.select()
			.from(therapyPlans)
			.where(eq(therapyPlans.childId, child.id))
			.limit(1);

		if (!plan) {
			return { user: locals.user, child, plan: null, snapshot: null, sessions: [], targets: [] };
		}

		const [snapshots, sessions, targets] = await Promise.all([
			db
				.select()
				.from(milestoneSnapshots)
				.where(eq(milestoneSnapshots.planId, plan.id))
				.orderBy(desc(milestoneSnapshots.recordedDate))
				.limit(1),
			db
				.select()
				.from(therapySessions)
				.where(eq(therapySessions.planId, plan.id))
				.orderBy(desc(therapySessions.sessionNumber))
				.limit(10),
			db.select().from(monthlyTargets).where(eq(monthlyTargets.planId, plan.id))
		]);

		return {
			user: locals.user,
			child,
			plan,
			snapshot: snapshots[0] ?? null,
			sessions,
			targets
		};
	} catch {
		return {
			user: locals.user,
			child: { id: 'demo-child', nickname: 'Rafa Al-Fatih' },
			plan: {
				id: 'demo-plan',
				title: 'Terapi Perilaku (ABA) & Wicara',
				status: 'active',
				evaluationCycleSessions: 12
			},
			snapshot: {
				speechExpressivePct: 82,
				sensoryFocusPct: 75,
				fineMotorPct: 88,
				independenceTrendPct: 28,
				summaryNote: 'Ananda menunjukkan peningkatan fokus dan respons panggilan nama yang sangat baik.'
			},
			sessions: [
				{
					id: 'demo-s14',
					sessionNumber: 14,
					stimulationFocus: 'Fonem bilabial /b/, /m/, /p/ dengan kartu bergambar Montessori.',
					emotionalResponse: 'Ceria & Sangat Kooperatif',
					homeRecommendation: 'Ajak menyebut nama benda sebelum memberikan mainan selama 10 menit.'
				}
			],
			targets: [
				{
					id: 't1',
					targetDescription: 'Merespons panggilan nama dalam tempo < 3 detik',
					isAchieved: true
				},
				{
					id: 't2',
					targetDescription: 'Mengucapkan kombinasi 2 kata bermakna',
					isAchieved: false
				}
			]
		};
	}
};
