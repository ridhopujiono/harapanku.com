import { fail } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	children,
	dailyStimulationLogs,
	screeningAnswers,
	screeningQuestions,
	screenings
} from '$lib/server/schema';
import { DEFAULT_QUESTIONS, type QuestionItem } from '$lib/data/defaults';
import {
	calculateDenverAges,
	computePillarScores,
	generate14DayRoadmap,
	type AnswerStatus,
	type PillarType
} from '$lib/utils/screening';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const rows = await db
			.select()
			.from(screeningQuestions)
			.where(eq(screeningQuestions.isActive, true))
			.orderBy(asc(screeningQuestions.sortOrder));

		const questions: QuestionItem[] =
			rows.length > 0
				? rows.map((q) => ({
						id: q.id,
						code: q.code,
						sourceStandard: q.sourceStandard,
						pillar: q.pillar,
						questionTemplate: q.questionTemplate,
						homeExample: q.homeExample,
						miniGameTitle: q.miniGameTitle,
						miniGameSteps: q.miniGameSteps as QuestionItem['miniGameSteps'],
						isCriticalIndicator: q.isCriticalIndicator,
						sortOrder: q.sortOrder
					}))
				: DEFAULT_QUESTIONS;

		return { questions };
	} catch {
		return { questions: DEFAULT_QUESTIONS };
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
			primaryConcerns: string[];
			answers: Array<{
				questionId: number;
				pillar: PillarType;
				status: AnswerStatus;
				isCritical: boolean;
				usedMiniGame: boolean;
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
		const scores = computePillarScores(parsed.answers);
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
				primaryConcerns: parsed.primaryConcerns,
				chronologicalAgeMonths: ageInfo.chronologicalMonths.toFixed(2),
				correctedAgeMonths: ageInfo.correctedMonths.toFixed(2),
				scoreWicaraPct: scores.scoreWicara,
				scoreOkupasiPct: scores.scoreOkupasi,
				scorePerilakuPct: scores.scorePerilaku,
				riskLevel: scores.riskLevel,
				clinicalSummary: scores.clinicalSummary,
				completedAt: now,
				createdAt: now
			});

			if (parsed.answers.length > 0) {
				await db.insert(screeningAnswers).values(
					parsed.answers.map((a) => ({
						id: crypto.randomUUID(),
						screeningId,
						questionId: a.questionId,
						answerStatus: a.status,
						usedMiniGame: a.usedMiniGame,
						answeredAt: now
					}))
				);
			}

			await db.insert(dailyStimulationLogs).values(logRows);
		} catch (err) {
			console.warn('[TumbuhKembang] DB offline saat menyimpan skrining, tampilkan hasil lokal:', err);
		}

		return {
			success: true,
			result: {
				screeningId,
				nickname: parsed.nickname,
				isPremature: parsed.isPremature,
				gestationalWeeks: parsed.gestationalWeeks,
				ageInfo,
				scores,
				roadmap: logRows
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
