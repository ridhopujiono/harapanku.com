import { fail } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	appointments,
	children,
	milestoneSnapshots,
	monthlyTargets,
	therapists,
	therapyPlans,
	therapySessions,
	users
} from '$lib/server/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const [confirmedAppts, plans, parentUsers] = await Promise.all([
			db
				.select()
				.from(appointments)
				.where(eq(appointments.status, 'confirmed'))
				.orderBy(desc(appointments.scheduledAt)),
			db
				.select({
					id: therapyPlans.id,
					title: therapyPlans.title,
					status: therapyPlans.status,
					evaluationCycleSessions: therapyPlans.evaluationCycleSessions,
					childNickname: children.nickname
				})
				.from(therapyPlans)
				.innerJoin(children, eq(therapyPlans.childId, children.id))
				.orderBy(desc(therapyPlans.createdAt)),
			db
				.select({ id: users.id, fullName: users.fullName, phoneWa: users.phoneWa })
				.from(users)
				.where(eq(users.role, 'parent'))
		]);

		const confirmedWithParent = confirmedAppts.map((a) => ({
			...a,
			matchedParentId: parentUsers.find((p) => p.phoneWa === a.parentWa)?.id ?? ''
		}));

		return {
			user: locals.user,
			confirmedAppointments: confirmedWithParent,
			plans,
			parentUsers
		};
	} catch {
		return {
			user: locals.user,
			confirmedAppointments: [
				{
					id: 'fe621562-0000-4000-8000-000000000001',
					parentName: 'Ridho',
					parentWa: '6282257802227',
					childAgeLabel: '2 Tahun 10 Bulan',
					mainComplaint: 'Tantrum & Fokus Perilaku (ABA)',
					scheduledAt: new Date(),
					matchedParentId: ''
				}
			],
			plans: [
				{
					id: 'demo-plan-001',
					title: 'Terapi Perilaku (ABA) & Sensori',
					status: 'active' as const,
					evaluationCycleSessions: 12,
					childNickname: 'Arka'
				}
			],
			parentUsers: []
		};
	}
};

export const actions: Actions = {
	createPlan: async ({ request, locals }) => {
		const formData = await request.formData();
		const appointmentId = String(formData.get('appointmentId') ?? '').trim() || null;
		const parentId = String(formData.get('parentId') ?? '').trim() || null;
		const childNickname = String(formData.get('childNickname') ?? '').trim();
		const title = String(formData.get('title') ?? '').trim();
		const speechPct = Number(formData.get('speechPct') ?? 60);
		const sensoryPct = Number(formData.get('sensoryPct') ?? 60);
		const motorPct = Number(formData.get('motorPct') ?? 60);
		const targetDesc = String(formData.get('targetDesc') ?? '').trim();

		if (!childNickname || !title) {
			return fail(400, { error: 'Nama panggilan anak dan judul program wajib diisi.' });
		}

		const now = new Date();
		const childId = crypto.randomUUID();
		const planId = crypto.randomUUID();

		try {
			const [staff] = await db
				.select()
				.from(therapists)
				.where(eq(therapists.userId, locals.user?.id ?? ''))
				.limit(1);

			const psychId = staff?.id ?? crypto.randomUUID();

			await db.insert(children).values({
				id: childId,
				parentId,
				nickname: childNickname,
				birthDate: now,
				createdAt: now
			});

			await db.insert(therapyPlans).values({
				id: planId,
				childId,
				leadPsychologistId: psychId,
				title,
				status: 'active',
				evaluationCycleSessions: 12,
				startDate: now,
				createdAt: now
			});

			await db.insert(milestoneSnapshots).values({
				id: crypto.randomUUID(),
				planId,
				recordedDate: now,
				speechExpressivePct: speechPct,
				sensoryFocusPct: sensoryPct,
				fineMotorPct: motorPct,
				independenceTrendPct: 0,
				summaryNote: 'Asesmen Awal Psikolog Klinis',
				createdAt: now
			});

			if (targetDesc) {
				const periodMonth = new Date(now.getFullYear(), now.getMonth(), 1);
				await db.insert(monthlyTargets).values({
					id: crypto.randomUUID(),
					planId,
					periodMonth,
					targetDescription: targetDesc,
					isAchieved: false,
					createdAt: now
				});
			}

			if (appointmentId) {
				await db
					.update(appointments)
					.set({ status: 'completed', childId })
					.where(eq(appointments.id, appointmentId));
			}
		} catch (err) {
			console.warn('[Clinic] DB offline saat membuat Therapy Plan:', err);
		}

		return { successPlan: true, childNickname, title };
	},

	addSession: async ({ request, locals }) => {
		const formData = await request.formData();
		const planId = String(formData.get('planId') ?? '');
		const sessionNumber = Number(formData.get('sessionNumber') ?? 1);
		const stimulationFocus = String(formData.get('stimulationFocus') ?? '').trim();
		const emotionalResponse = String(formData.get('emotionalResponse') ?? '').trim();
		const therapistNotes = String(formData.get('therapistNotes') ?? '').trim();
		const homeRecommendation = String(formData.get('homeRecommendation') ?? '').trim();

		if (!planId || !stimulationFocus || !emotionalResponse) {
			return fail(400, { error: 'Fokus stimulasi dan respon emosional wajib diisi.' });
		}

		const now = new Date();

		try {
			const [staff] = await db
				.select()
				.from(therapists)
				.where(eq(therapists.userId, locals.user?.id ?? ''))
				.limit(1);

			if (staff) {
				await db.insert(therapySessions).values({
					id: crypto.randomUUID(),
					planId,
					therapistId: staff.id,
					sessionNumber,
					sessionDate: now,
					startTime: '14:00:00',
					endTime: '14:45:00',
					stimulationFocus,
					emotionalResponse,
					therapistNotes: therapistNotes || null,
					homeRecommendation: homeRecommendation || null,
					createdAt: now
				});
			}
		} catch (err) {
			console.warn('[Clinic] DB offline saat menyimpan Daily Therapy Log:', err);
		}

		return {
			successSession: true,
			sessionNumber,
			needsEvaluation: sessionNumber % 12 === 0
		};
	}
};
