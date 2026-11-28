import { fail } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { and, asc, eq, isNotNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	children,
	dailyStimulationLogs,
	screeningAnswers,
	screeningQuestions,
	screenings
} from '$lib/server/schema';
import {
	AGE_GROUP_LABELS,
	ASPECT_META,
	MILESTONE_QUESTIONS,
	type MilestoneAspect,
	type MilestoneChoice,
	type MilestoneQuestion
} from '$lib/data/milestone-screening';
import {
	calculateDenverAges,
	generate14DayRoadmap,
	summarizeMilestoneAspects,
	type AnswerStatus
} from '$lib/utils/screening';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const rows = await db
			.select()
			.from(screeningQuestions)
			.where(and(eq(screeningQuestions.isActive, true), isNotNull(screeningQuestions.ageGroupMonths)))
			.orderBy(asc(screeningQuestions.sortOrder));

		const questions: MilestoneQuestion[] =
			rows.length >= 132
				? rows.map((q) => {
						const aspect = (q.aspect ?? 'motorik_kasar') as MilestoneAspect;
						const ageGroup = q.ageGroupMonths ?? 12;
						return {
							id: q.id,
							code: q.code,
							ageGroupMonths: ageGroup,
							ageGroupLabel: AGE_GROUP_LABELS[ageGroup] ?? `${ageGroup} bulan`,
							aspect,
							aspectLabel: ASPECT_META[aspect]?.label ?? aspect,
							questionNumber: ((q.sortOrder - 1) % 3) + 1,
							questionText: q.questionTemplate,
							verificationGuide: q.homeExample,
							pillar: q.pillar
						};
					})
				: MILESTONE_QUESTIONS;

		return { questions };
	} catch {
		return { questions: MILESTONE_QUESTIONS };
	}
};

export const actions: Actions = {
	submitScreening: async ({ request, locals }) => {
		const formData = await request.formData();
		const payloadRaw = String(formData.get('payload') ?? '');

		if (!payloadRaw) {
			return fail(400, { error: 'Data skrining tidak valid.' });
		}

		let parsed: {
			nickname: string;
			birthDate: string;
			isPremature: boolean;
			gestationalWeeks: number;
			selectedAgeGroup: number;
			hasRegressionOrConcern: boolean;
			parentConcernNotes: string;
			answers: Array<{
				questionId: number;
				aspect: MilestoneAspect;
				pillar: 'wicara' | 'okupasi' | 'perilaku';
				choice: MilestoneChoice;
				notes: string;
			}>;
		};

		try {
			parsed = JSON.parse(payloadRaw);
		} catch {
			return fail(400, { error: 'Format data skrining tidak valid.' });
		}

		const ageInfo = calculateDenverAges(
			parsed.birthDate,
			parsed.isPremature,
			parsed.gestationalWeeks
		);
		const aspectSummary = summarizeMilestoneAspects(
			parsed.answers.map((a) => ({ aspect: a.aspect, choice: a.choice })),
			parsed.hasRegressionOrConcern
		);
		const roadmap = generate14DayRoadmap(parsed.nickname);

		const childId = crypto.randomUUID();
		const screeningId = crypto.randomUUID();
		const now = new Date();

		const logRows = roadmap.map((item) => ({
			id: crypto.randomUUID(),
			screeningId,
			dayNumber: item.dayNumber,
			pillar: item.pillar,
			activityTitle: item.activityTitle,
			activityDescription: item.activityDescription,
			isCompleted: false,
			completedAt: null
		}));

		const choiceToStatus = (c: MilestoneChoice): AnswerStatus =>
			c === 'ya' ? 'optimal' : c === 'belum_dinilai' ? 'stimulasi' : 'perlu_pantauan';

		try {
			await db.insert(children).values({
				id: childId,
				parentId: locals.user?.id ?? null,
				nickname: parsed.nickname,
				birthDate: new Date(parsed.birthDate),
				isPremature: parsed.isPremature,
				gestationalWeeks: parsed.isPremature ? parsed.gestationalWeeks : null,
				createdAt: now
			});

			await db.insert(screenings).values({
				id: screeningId,
				childId,
				guestSessionToken: locals.guestToken,
				primaryConcerns: {
					ageGroupMonths: parsed.selectedAgeGroup,
					hasRegressionOrConcern: parsed.hasRegressionOrConcern,
					parentConcernNotes: parsed.parentConcernNotes
				},
				chronologicalAgeMonths: ageInfo.chronologicalMonths.toFixed(2),
				correctedAgeMonths: ageInfo.correctedMonths.toFixed(2),
				riskLevel: aspectSummary.needsFollowUp ? 'stimulasi' : 'optimal',
				clinicalSummary: aspectSummary.followUpSummary,
				completedAt: now,
				createdAt: now
			});

			if (parsed.answers.length > 0) {
				await db.insert(screeningAnswers).values(
					parsed.answers.map((a) => ({
						id: crypto.randomUUID(),
						screeningId,
						questionId: a.questionId,
						answerStatus: choiceToStatus(a.choice),
						answerChoice: a.choice,
						notes: a.notes || null,
						usedMiniGame: false,
						answeredAt: now
					}))
				);
			}

			await db.insert(dailyStimulationLogs).values(logRows);
		} catch (err) {
			console.warn('[TumbuhKembang] DB error/offline saat menyimpan skrining:', err);
		}

		return {
			success: true,
			result: {
				screeningId,
				nickname: parsed.nickname,
				isPremature: parsed.isPremature,
				gestationalWeeks: parsed.gestationalWeeks,
				ageGroupLabel: AGE_GROUP_LABELS[parsed.selectedAgeGroup] ?? `${parsed.selectedAgeGroup} bulan`,
				hasRegressionOrConcern: parsed.hasRegressionOrConcern,
				parentConcernNotes: parsed.parentConcernNotes,
				ageInfo,
				aspectSummary,
				roadmap: logRows,
				answersDetail: parsed.answers
			}
		};
	},

	toggleLog: async ({ request }) => {
		const formData = await request.formData();
		const logId = String(formData.get('logId') ?? '');
		const isCompleted = formData.get('isCompleted') === 'true';

		if (!logId) return fail(400, { error: 'ID aktivitas tidak ditemukan.' });

		try {
			await db
				.update(dailyStimulationLogs)
				.set({
					isCompleted,
					completedAt: isCompleted ? new Date() : null
				})
				.where(eq(dailyStimulationLogs.id, logId));
		} catch {
			// Graceful fallback if DB is offline locally
		}

		return { toggled: true, logId, isCompleted };
	}
};
