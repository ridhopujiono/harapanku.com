import {
	mysqlTable,
	char,
	varchar,
	text,
	boolean,
	datetime,
	date,
	time,
	int,
	smallint,
	tinyint,
	decimal,
	json,
	mysqlEnum
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: char('id', { length: 36 }).primaryKey(),
	fullName: varchar('full_name', { length: 120 }).notNull(),
	email: varchar('email', { length: 150 }).unique(),
	phoneWa: varchar('phone_wa', { length: 20 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }),
	role: mysqlEnum('role', ['parent', 'therapist', 'psychologist', 'admin'])
		.notNull()
		.default('parent'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: datetime('created_at').notNull(),
	updatedAt: datetime('updated_at').notNull()
});

export const therapists = mysqlTable('therapists', {
	id: char('id', { length: 36 }).primaryKey(),
	userId: char('user_id', { length: 36 }).notNull().unique(),
	strNumber: varchar('str_number', { length: 50 }).notNull().unique(),
	licenseOrg: varchar('license_org', { length: 50 }).notNull(),
	specialization: mysqlEnum('specialization', [
		'ABA',
		'Speech',
		'Occupational',
		'Psychologist'
	]).notNull(),
	bio: text('bio'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: datetime('created_at').notNull()
});

export const children = mysqlTable('children', {
	id: char('id', { length: 36 }).primaryKey(),
	parentId: char('parent_id', { length: 36 }),
	nickname: varchar('nickname', { length: 60 }).notNull(),
	fullName: varchar('full_name', { length: 120 }),
	birthDate: date('birth_date').notNull(),
	gender: mysqlEnum('gender', ['L', 'P']),
	isPremature: boolean('is_premature').notNull().default(false),
	gestationalWeeks: tinyint('gestational_weeks', { unsigned: true }),
	createdAt: datetime('created_at').notNull(),
	deletedAt: datetime('deleted_at')
});

export const screeningQuestions = mysqlTable('screening_questions', {
	id: int('id', { unsigned: true }).autoincrement().primaryKey(),
	code: varchar('code', { length: 30 }).notNull().unique(),
	sourceStandard: varchar('source_standard', { length: 50 }).notNull(),
	pillar: mysqlEnum('pillar', ['wicara', 'okupasi', 'perilaku']).notNull(),
	ageGroupMonths: smallint('age_group_months', { unsigned: true }),
	aspect: varchar('aspect', { length: 40 }),
	minAgeMonths: smallint('min_age_months', { unsigned: true }).notNull().default(0),
	maxAgeMonths: smallint('max_age_months', { unsigned: true }).notNull().default(144),
	questionTemplate: text('question_template').notNull(),
	homeExample: text('home_example').notNull(),
	miniGameTitle: varchar('mini_game_title', { length: 120 }),
	miniGameSteps: json('mini_game_steps'),
	isCriticalIndicator: boolean('is_critical_indicator').notNull().default(false),
	sortOrder: smallint('sort_order', { unsigned: true }).notNull().default(1),
	isActive: boolean('is_active').notNull().default(true)
});

export const screenings = mysqlTable('screenings', {
	id: char('id', { length: 36 }).primaryKey(),
	childId: char('child_id', { length: 36 }).notNull(),
	guestSessionToken: varchar('guest_session_token', { length: 100 }),
	primaryConcerns: json('primary_concerns').notNull(),
	chronologicalAgeMonths: decimal('chronological_age_months', { precision: 5, scale: 2 }).notNull(),
	correctedAgeMonths: decimal('corrected_age_months', { precision: 5, scale: 2 }).notNull(),
	scoreWicaraPct: tinyint('score_wicara_pct', { unsigned: true }),
	scoreOkupasiPct: tinyint('score_okupasi_pct', { unsigned: true }),
	scorePerilakuPct: tinyint('score_perilaku_pct', { unsigned: true }),
	riskLevel: mysqlEnum('risk_level', ['optimal', 'stimulasi', 'perlu_evaluasi']),
	clinicalSummary: text('clinical_summary'),
	pdfReportUrl: varchar('pdf_report_url', { length: 255 }),
	completedAt: datetime('completed_at'),
	createdAt: datetime('created_at').notNull()
});

export const screeningAnswers = mysqlTable('screening_answers', {
	id: char('id', { length: 36 }).primaryKey(),
	screeningId: char('screening_id', { length: 36 }).notNull(),
	questionId: int('question_id', { unsigned: true }).notNull(),
	answerStatus: mysqlEnum('answer_status', ['optimal', 'stimulasi', 'perlu_pantauan']).notNull(),
	answerChoice: mysqlEnum('answer_choice', ['ya', 'tidak', 'belum_dinilai']),
	notes: text('notes'),
	usedMiniGame: boolean('used_mini_game').notNull().default(false),
	answeredAt: datetime('answered_at').notNull()
});

export const dailyStimulationLogs = mysqlTable('daily_stimulation_logs', {
	id: char('id', { length: 36 }).primaryKey(),
	screeningId: char('screening_id', { length: 36 }).notNull(),
	dayNumber: tinyint('day_number', { unsigned: true }).notNull(),
	pillar: mysqlEnum('pillar', ['wicara', 'okupasi', 'perilaku', 'semua']).notNull(),
	activityTitle: varchar('activity_title', { length: 120 }).notNull(),
	activityDescription: text('activity_description').notNull(),
	isCompleted: boolean('is_completed').notNull().default(false),
	completedAt: datetime('completed_at')
});

export const services = mysqlTable('services', {
	id: int('id', { unsigned: true }).autoincrement().primaryKey(),
	slug: varchar('slug', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 100 }).notNull(),
	categoryLabel: varchar('category_label', { length: 80 }).notNull(),
	durationMinutes: smallint('duration_minutes', { unsigned: true }).notNull(),
	description: text('description').notNull(),
	highlights: json('highlights').notNull(),
	isActive: boolean('is_active').notNull().default(true)
});

export const assessmentPackages = mysqlTable('assessment_packages', {
	id: int('id', { unsigned: true }).autoincrement().primaryKey(),
	slug: varchar('slug', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 100 }).notNull(),
	priceIdr: int('price_idr', { unsigned: true }).notNull(),
	observationMinutes: smallint('observation_minutes', { unsigned: true }).notNull(),
	dashboardFreeDays: smallint('dashboard_free_days', { unsigned: true }).notNull().default(0),
	features: json('features').notNull(),
	isRecommended: boolean('is_recommended').notNull().default(false),
	isActive: boolean('is_active').notNull().default(true)
});

export const appointments = mysqlTable('appointments', {
	id: char('id', { length: 36 }).primaryKey(),
	childId: char('child_id', { length: 36 }),
	serviceId: int('service_id', { unsigned: true }),
	packageId: int('package_id', { unsigned: true }),
	therapistId: char('therapist_id', { length: 36 }),
	parentName: varchar('parent_name', { length: 120 }).notNull(),
	parentWa: varchar('parent_wa', { length: 20 }).notNull(),
	childAgeLabel: varchar('child_age_label', { length: 50 }).notNull(),
	mainComplaint: varchar('main_complaint', { length: 100 }).notNull(),
	scheduledAt: datetime('scheduled_at'),
	status: mysqlEnum('status', ['pending_wa', 'confirmed', 'completed', 'cancelled'])
		.notNull()
		.default('pending_wa'),
	adminNotes: text('admin_notes'),
	createdAt: datetime('created_at').notNull()
});

export const therapyPlans = mysqlTable('therapy_plans', {
	id: char('id', { length: 36 }).primaryKey(),
	childId: char('child_id', { length: 36 }).notNull(),
	leadPsychologistId: char('lead_psychologist_id', { length: 36 }).notNull(),
	title: varchar('title', { length: 120 }).notNull(),
	status: mysqlEnum('status', ['active', 'paused', 'graduated']).notNull().default('active'),
	evaluationCycleSessions: smallint('evaluation_cycle_sessions', { unsigned: true })
		.notNull()
		.default(12),
	startDate: date('start_date').notNull(),
	createdAt: datetime('created_at').notNull()
});

export const therapySessions = mysqlTable('therapy_sessions', {
	id: char('id', { length: 36 }).primaryKey(),
	planId: char('plan_id', { length: 36 }).notNull(),
	therapistId: char('therapist_id', { length: 36 }).notNull(),
	sessionNumber: int('session_number', { unsigned: true }).notNull(),
	sessionDate: date('session_date').notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	stimulationFocus: text('stimulation_focus').notNull(),
	emotionalResponse: varchar('emotional_response', { length: 80 }).notNull(),
	therapistNotes: text('therapist_notes'),
	homeRecommendation: text('home_recommendation'),
	createdAt: datetime('created_at').notNull()
});

export const milestoneSnapshots = mysqlTable('milestone_snapshots', {
	id: char('id', { length: 36 }).primaryKey(),
	planId: char('plan_id', { length: 36 }).notNull(),
	recordedDate: date('recorded_date').notNull(),
	speechExpressivePct: tinyint('speech_expressive_pct', { unsigned: true }).notNull(),
	sensoryFocusPct: tinyint('sensory_focus_pct', { unsigned: true }).notNull(),
	fineMotorPct: tinyint('fine_motor_pct', { unsigned: true }).notNull(),
	independenceTrendPct: smallint('independence_trend_pct'),
	summaryNote: text('summary_note'),
	createdAt: datetime('created_at').notNull()
});

export const monthlyTargets = mysqlTable('monthly_targets', {
	id: char('id', { length: 36 }).primaryKey(),
	planId: char('plan_id', { length: 36 }).notNull(),
	periodMonth: date('period_month').notNull(),
	targetDescription: varchar('target_description', { length: 255 }).notNull(),
	isAchieved: boolean('is_achieved').notNull().default(false),
	achievedAt: datetime('achieved_at'),
	createdAt: datetime('created_at').notNull()
});

export const cmsSections = mysqlTable('cms_sections', {
	sectionKey: varchar('section_key', { length: 50 }).primaryKey(),
	content: json('content').notNull(),
	updatedAt: datetime('updated_at').notNull()
});
