<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		AGE_GROUP_LABELS,
		MILESTONE_AGE_GROUPS,
		OFFICIAL_REFERENCES,
		selectMilestoneAgeGroup,
		type MilestoneChoice
	} from '$lib/data/milestone-screening';
	import { calculateDenverAges, type PillarType } from '$lib/utils/screening';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let step = $state<1 | 2 | 3>(1);

	// Step 1 state
	let nickname = $state('Arka');
	let birthDate = $state('2024-06-15');
	let isPremature = $state(false);
	let gestationalWeeks = $state(33);
	let manualAgeGroup = $state<number | null>(null);
	let hasRegressionOrConcern = $state(false);
	let parentConcernNotes = $state('');

	let agePreview = $derived(calculateDenverAges(birthDate, isPremature, gestationalWeeks));
	let effectiveMonths = $derived(
		isPremature ? agePreview.correctedMonths : agePreview.chronologicalMonths
	);
	let selectedAgeGroup = $derived(manualAgeGroup ?? selectMilestoneAgeGroup(effectiveMonths));
	let activeQuestions = $derived(
		data.questions.filter((q) => q.ageGroupMonths === selectedAgeGroup)
	);

	// Step 2 state
	let currentIdx = $state(0);
	let answers = $state<Record<number, { choice: MilestoneChoice; notes: string }>>({});
	let showStopwatch = $state(false);
	let timerSeconds = $state(60);
	let timerRunning = $state(false);
	let timerHandle = $state<ReturnType<typeof setInterval> | null>(null);
	let validationMsg = $state('');
	let isSubmitting = $state(false);

	let currentQuestion = $derived(activeQuestions[currentIdx]);
	let currentAnswer = $derived(currentQuestion ? answers[currentQuestion.id] : undefined);

	// Step 3 state
	let roadmapFilter = $state<'semua' | PillarType>('semua');
	let localCompleted = $state<Record<string, boolean>>({});

	$effect(() => {
		if (form?.result) {
			step = 3;
			const initMap: Record<string, boolean> = {};
			for (const item of form.result.roadmap) {
				initMap[item.id] = item.isCompleted;
			}
			localCompleted = initMap;
		}
	});

	function selectChoice(choice: MilestoneChoice) {
		if (!currentQuestion) return;
		answers = {
			...answers,
			[currentQuestion.id]: {
				choice,
				notes: answers[currentQuestion.id]?.notes ?? ''
			}
		};
		validationMsg = '';
	}

	function updateNote(noteText: string) {
		if (!currentQuestion) return;
		const existing = answers[currentQuestion.id];
		if (!existing) return;
		answers = {
			...answers,
			[currentQuestion.id]: {
				...existing,
				notes: noteText
			}
		};
	}

	function stopTimer() {
		if (timerHandle) clearInterval(timerHandle);
		timerHandle = null;
		timerRunning = false;
	}

	function startTimer() {
		if (timerRunning) {
			stopTimer();
			return;
		}
		if (timerSeconds <= 0) timerSeconds = 60;
		timerRunning = true;
		timerHandle = setInterval(() => {
			if (timerSeconds <= 1) {
				timerSeconds = 0;
				stopTimer();
			} else {
				timerSeconds -= 1;
			}
		}, 1000);
	}

	function resetTimer() {
		stopTimer();
		timerSeconds = 60;
	}

	function startScreeningQuestions() {
		if (!nickname.trim() || !birthDate) return;
		currentIdx = 0;
		answers = {};
		validationMsg = '';
		step = 2;
	}

	function nextQuestion() {
		if (!currentQuestion || !answers[currentQuestion.id]) {
			validationMsg = 'Silakan pilih salah satu opsi (Ya, Tidak, atau Belum dinilai) sebelum melanjutkan.';
			return;
		}
		validationMsg = '';
		showStopwatch = false;
		resetTimer();
		if (currentIdx < activeQuestions.length - 1) {
			currentIdx += 1;
		}
	}

	function prevQuestion() {
		validationMsg = '';
		showStopwatch = false;
		resetTimer();
		if (currentIdx > 0) {
			currentIdx -= 1;
		} else {
			step = 1;
		}
	}

	let serializedPayload = $derived(
		JSON.stringify({
			nickname: nickname.trim() || 'Si Kecil',
			birthDate,
			isPremature,
			gestationalWeeks,
			selectedAgeGroup,
			hasRegressionOrConcern,
			parentConcernNotes: parentConcernNotes.trim(),
			answers: activeQuestions
				.filter((q) => answers[q.id])
				.map((q) => ({
					questionId: q.id,
					aspect: q.aspect,
					pillar: q.pillar,
					choice: answers[q.id].choice,
					notes: answers[q.id].notes
				}))
		})
	);

	let completedLogsCount = $derived(Object.values(localCompleted).filter(Boolean).length);
</script>

<svelte:head>
	<title>Skrining Perkembangan Anak 1–5 Tahun — TumbuhKembang.id &amp; Harapanku</title>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] text-slate-900">
	<header class="border-b border-slate-200 bg-white print:hidden">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
			<a href="/" class="flex items-center gap-3">
				<img src="/assets/images/logo.png" alt="Harapanku" class="h-9 w-auto" />
				<span class="hidden text-xs font-bold text-teal-700 sm:inline">
					🌱 TumbuhKembang.id
				</span>
			</a>
			<span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
				Pemantauan Milestone Usia 1–5 Tahun
			</span>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
		<!-- Disclaimer Klinis -->
		<div class="mb-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-950">
			<strong>Catatan Penting:</strong> Instrumen pemantauan awal berbasis milestone (Buku KIA 2024 &amp; Pedoman SDIDTK Kemenkes 2022).
			<strong>Bukan formulir KPSP resmi dan bukan alat diagnosis</strong> — tidak memiliki skor ambang tervalidasi.
		</div>

		<!-- Progress Header -->
		<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs print:hidden">
			<div class="flex items-center justify-between text-xs font-semibold text-slate-600">
				<span>
					{step === 1
						? 'Langkah 1 dari 3: Identitas & Kelompok Usia Pemeriksaan'
						: step === 2
							? `Langkah 2 dari 3: Pertanyaan ${currentIdx + 1} dari ${activeQuestions.length} (${AGE_GROUP_LABELS[selectedAgeGroup]})`
							: 'Langkah 3 dari 3: Ringkasan Pemantauan & Tindak Lanjut'}
				</span>
				<span class="text-teal-700">
					{step === 1
						? '33%'
						: step === 2
							? `${Math.round(33 + ((currentIdx + 1) / Math.max(1, activeQuestions.length)) * 34)}%`
							: '100%'}
				</span>
			</div>
			<div class="mt-2 h-2 w-full rounded-full bg-slate-100">
				<div
					class="h-2 rounded-full bg-teal-600 transition-all"
					style="width: {step === 1
						? '33%'
						: step === 2
							? `${Math.round(33 + ((currentIdx + 1) / Math.max(1, activeQuestions.length)) * 34)}%`
							: '100%'}"
				></div>
			</div>
		</div>

		{#if step === 1}
			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<span class="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
					Buku KIA 2024 &amp; Pedoman SDIDTK Kemenkes RI
				</span>
				<h1 class="mt-3 font-heading text-2xl font-bold text-slate-900">
					Formulir Skrining Perkembangan Anak (1–5 Tahun)
				</h1>
				<p class="mt-1 text-sm text-slate-600">
					Memantau 4 aspek perkembangan: <strong>Motorik Kasar</strong>, <strong>Motorik Halus</strong>,
					<strong>Bahasa &amp; Komunikasi</strong>, dan <strong>Sosialisasi &amp; Kemandirian</strong>.
				</p>

				<div class="mt-6 space-y-5">
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="nickname" class="block text-sm font-semibold text-slate-700">
								Nama Panggilan Anak *
							</label>
							<input
								id="nickname"
								bind:value={nickname}
								class="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
							/>
						</div>

						<div>
							<label for="birthDate" class="block text-sm font-semibold text-slate-700">
								Tanggal Lahir Anak *
							</label>
							<input
								id="birthDate"
								type="date"
								bind:value={birthDate}
								class="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
							/>
						</div>
					</div>

					<div class="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
						<label class="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-teal-900">
							<input type="checkbox" bind:checked={isPremature} class="h-4 w-4 accent-teal-600" />
							<span>Apakah si Kecil lahir prematur (&lt; 37 minggu)?</span>
						</label>

						{#if isPremature}
							<div class="mt-4">
								<div class="flex justify-between text-xs font-medium text-teal-900">
									<span>Usia Kehamilan saat Lahir</span>
									<span>{gestationalWeeks} Minggu</span>
								</div>
								<input
									type="range"
									min="24"
									max="36"
									bind:value={gestationalWeeks}
									class="mt-2 w-full accent-teal-600"
								/>
							</div>
						{/if}

						<div class="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
							<div class="rounded-xl bg-white p-2.5">
								<span class="block text-slate-500">Usia Kronologis</span>
								<strong class="text-slate-900">{agePreview.chronologicalLabel}</strong>
							</div>
							<div class="rounded-xl bg-white p-2.5">
								<span class="block text-slate-500">Usia Koreksi (Pedoman SDIDTK)</span>
								<strong class="text-teal-700">{agePreview.correctedLabel}</strong>
							</div>
						</div>
					</div>

					<div>
						<label for="ageGroupSelect" class="block text-sm font-semibold text-slate-700">
							Kelompok Usia Pemeriksaan (Otomatis sesuai usia anak)
						</label>
						<select
							id="ageGroupSelect"
							value={selectedAgeGroup}
							onchange={(e) => (manualAgeGroup = Number(e.currentTarget.value))}
							class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
						>
							{#each MILESTONE_AGE_GROUPS as grp}
								<option value={grp}>{AGE_GROUP_LABELS[grp]} — 12 Pertanyaan (4 Aspek)</option>
							{/each}
						</select>
					</div>

					<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<label class="flex cursor-pointer items-start gap-2.5 text-sm font-semibold text-slate-800">
							<input
								type="checkbox"
								bind:checked={hasRegressionOrConcern}
								class="mt-0.5 h-4 w-4 accent-teal-600"
							/>
							<span>
								Ada kekhawatiran khusus orang tua atau kemampuan yang sebelumnya sudah bisa namun kini hilang (regresi)
							</span>
						</label>
						{#if hasRegressionOrConcern}
							<textarea
								bind:value={parentConcernNotes}
								rows="2"
								placeholder="Tuliskan kekhawatiran singkat Anda (opsional)..."
								class="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
							></textarea>
						{/if}
					</div>

					<button
						type="button"
						onclick={startScreeningQuestions}
						class="w-full cursor-pointer rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white hover:bg-teal-700"
					>
						Mulai Skrining ({AGE_GROUP_LABELS[selectedAgeGroup]} • {activeQuestions.length} Pertanyaan) &rarr;
					</button>
				</div>
			</div>
		{:else if step === 2 && currentQuestion}
			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<div class="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
					<div class="flex items-center gap-2">
						<span class="rounded-full bg-teal-50 px-3 py-1 text-teal-800">
							{currentQuestion.aspectLabel}
						</span>
						<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
							Butir {currentQuestion.questionNumber}/3
						</span>
					</div>
					<span class="text-slate-500">
						Pertanyaan {currentIdx + 1} / {activeQuestions.length}
					</span>
				</div>

				<h2 class="mt-4 font-heading text-xl font-bold text-slate-900">
					{currentQuestion.questionText}
				</h2>

				<div class="mt-4 rounded-2xl bg-blue-50/70 p-4 text-sm text-slate-800">
					<p class="text-xs font-bold uppercase tracking-wide text-blue-800">
						Cara Verifikasi / Contoh Observasi
					</p>
					<p class="mt-1 text-xs leading-relaxed sm:text-sm">{currentQuestion.verificationGuide}</p>
				</div>

				<!-- 3 Opsi Jawaban Sesuai Panduan Formulir -->
				<div class="mt-6 space-y-2.5">
					<button
						type="button"
						onclick={() => selectChoice('ya')}
						class="w-full cursor-pointer rounded-xl border p-3.5 text-left text-sm transition {currentAnswer?.choice ===
						'ya'
							? 'border-emerald-600 bg-emerald-50 text-emerald-950'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						<strong class="block">✓ Ya</strong>
						<span class="text-xs text-slate-600">
							Kemampuan sudah tampak dan dapat dilakukan {nickname} secara konsisten.
						</span>
					</button>

					<button
						type="button"
						onclick={() => selectChoice('tidak')}
						class="w-full cursor-pointer rounded-xl border p-3.5 text-left text-sm transition {currentAnswer?.choice ===
						'tidak'
							? 'border-rose-600 bg-rose-50 text-rose-950'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						<strong class="block">✕ Tidak</strong>
						<span class="text-xs text-slate-600">
							Kemampuan belum tampak atau {nickname} belum dapat melakukannya saat ditanya/diamati.
						</span>
					</button>

					<button
						type="button"
						onclick={() => selectChoice('belum_dinilai')}
						class="w-full cursor-pointer rounded-xl border p-3.5 text-left text-sm transition {currentAnswer?.choice ===
						'belum_dinilai'
							? 'border-amber-600 bg-amber-50 text-amber-950'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						<strong class="block">? Belum dinilai</strong>
						<span class="text-xs text-slate-600">
							Belum ada kesempatan menilai atau anak sedang tidak kooperatif (tidak dianggap "Ya").
						</span>
					</button>
				</div>

				{#if currentAnswer}
					<div class="mt-4">
						<label for="obs-note" class="block text-xs font-semibold text-slate-600">
							Catatan Observasi Orang Tua (Opsional)
						</label>
						<input
							id="obs-note"
							value={currentAnswer.notes}
							oninput={(e) => updateNote(e.currentTarget.value)}
							placeholder="Contoh: baru mau mencoba jika dicontohkan..."
							class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
						/>
					</div>
				{/if}

				<!-- Optional 60s Stopwatch Helper -->
				<div class="mt-4">
					<button
						type="button"
						onclick={() => (showStopwatch = !showStopwatch)}
						class="cursor-pointer text-xs font-semibold text-teal-700 hover:underline"
					>
						{showStopwatch ? 'Sembunyikan Stopwatch Observasi' : '⏱️ Buka Stopwatch Observasi 60 Detik (Jika ingin coba langsung)'}
					</button>
					{#if showStopwatch}
						<div class="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/60 p-3">
							<span class="rounded-lg bg-white px-3 py-1 font-mono text-sm font-bold text-teal-800">
								{timerSeconds}d
							</span>
							<button
								type="button"
								onclick={startTimer}
								class="cursor-pointer rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
							>
								{timerRunning ? 'Jeda' : 'Mulai 60 Detik'}
							</button>
							<button
								type="button"
								onclick={resetTimer}
								class="cursor-pointer rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800"
							>
								Reset
							</button>
						</div>
					{/if}
				</div>

				{#if validationMsg}
					<p class="mt-3 text-xs font-semibold text-rose-600">{validationMsg}</p>
				{/if}

				<div class="mt-6 flex items-center justify-between gap-3">
					<button
						type="button"
						onclick={prevQuestion}
						class="cursor-pointer rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
					>
						&larr; Kembali
					</button>

					{#if currentIdx < activeQuestions.length - 1}
						<button
							type="button"
							onclick={nextQuestion}
							class="cursor-pointer rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
						>
							Pertanyaan Berikutnya &rarr;
						</button>
					{:else}
						<form
							method="POST"
							action="?/submitScreening"
							use:enhance={({ cancel }) => {
								if (!currentQuestion || !answers[currentQuestion.id]) {
									validationMsg = 'Silakan pilih jawaban terakhir sebelum melihat hasil.';
									cancel();
									return;
								}
								isSubmitting = true;
								return async ({ update }) => {
									await update();
									isSubmitting = false;
								};
							}}
						>
							<input type="hidden" name="payload" value={serializedPayload} />
							<button
								type="submit"
								disabled={isSubmitting}
								class="cursor-pointer rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
							>
								{isSubmitting ? 'Menyimpan...' : 'Lihat Ringkasan & Tindak Lanjut ➔'}
							</button>
						</form>
					{/if}
				</div>
			</div>
		{:else if step === 3 && form?.result}
			<div class="space-y-6">
				<div class="rounded-3xl border border-teal-200 bg-white p-6 shadow-sm">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<span class="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
								Pemantauan Awal Selesai • {form.result.ageGroupLabel}
							</span>
							<h1 class="mt-2 font-heading text-2xl font-bold text-slate-900">
								Ringkasan Observasi {form.result.nickname}
							</h1>
							<p class="mt-1 text-xs text-slate-500">
								Usia Kronologis: {form.result.ageInfo.chronologicalLabel} • Usia Koreksi:
								{form.result.ageInfo.correctedLabel}
							</p>
						</div>
						<button
							type="button"
							onclick={() => window.print()}
							class="cursor-pointer rounded-xl border border-teal-600 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 print:hidden"
						>
							📄 Cetak / Simpan PDF
						</button>
					</div>

					<div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950">
						<strong>Prinsip Interpretasi:</strong> Checklist ini tidak memiliki skor ambang tervalidasi dan
						tidak menetapkan diagnosis. Gunakan ringkasan di bawah untuk melihat kemampuan yang sudah tampak
						dan yang perlu ditindaklanjuti bersama tenaga kesehatan/Psikolog.
					</div>

					<!-- Rekap Kualitatif 4 Aspek -->
					<div class="mt-6 grid gap-4 sm:grid-cols-2">
						{#each form.result.aspectSummary.summaries as asp}
							<div class="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
								<p class="font-heading text-sm font-bold text-slate-900">{asp.label}</p>
								<div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
									<span class="rounded-lg bg-emerald-100 px-2.5 py-1 text-emerald-800">
										Ya: {asp.yaCount}/{asp.total}
									</span>
									<span class="rounded-lg bg-rose-100 px-2.5 py-1 text-rose-800">
										Tidak: {asp.tidakCount}/{asp.total}
									</span>
									<span class="rounded-lg bg-amber-100 px-2.5 py-1 text-amber-800">
										Belum dinilai: {asp.belumDinilaiCount}/{asp.total}
									</span>
								</div>
							</div>
						{/each}
					</div>

					<div class="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-sm text-slate-800">
						<p class="font-bold text-teal-900">Saran Tindak Lanjut:</p>
						<p class="mt-1 text-xs leading-relaxed sm:text-sm">
							{form.result.aspectSummary.followUpSummary}
						</p>
						{#if form.result.hasRegressionOrConcern && form.result.parentConcernNotes}
							<p class="mt-2 text-xs text-slate-700">
								<strong>Catatan Kekhawatiran Orang Tua:</strong> {form.result.parentConcernNotes}
							</p>
						{/if}
					</div>
				</div>

				<!-- Roadmap Stimulasi 14 Hari -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h2 class="font-heading text-lg font-bold text-slate-900">
								Ide Stimulasi Bermain 14 Hari di Rumah (Tanpa Layar)
							</h2>
							<p class="text-xs text-slate-500">
								{completedLogsCount} dari {form.result.roadmap.length} Aktivitas Diselesaikan
							</p>
						</div>
						<div class="flex gap-1.5 print:hidden">
							{#each ['semua', 'wicara', 'okupasi', 'perilaku'] as f}
								<button
									type="button"
									onclick={() => (roadmapFilter = f as 'semua' | PillarType)}
									class="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold capitalize {roadmapFilter ===
									f
										? 'bg-teal-600 text-white'
										: 'bg-slate-100 text-slate-600'}"
								>
									{f}
								</button>
							{/each}
						</div>
					</div>

					<div class="mt-4 space-y-2.5">
						{#each form.result.roadmap.filter((r) => roadmapFilter === 'semua' || r.pillar === roadmapFilter) as item (item.id)}
							<label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
								<input
									type="checkbox"
									checked={Boolean(localCompleted[item.id])}
									onchange={(e) => {
										const checked = e.currentTarget.checked;
										localCompleted = { ...localCompleted, [item.id]: checked };
									}}
									class="mt-1 h-4 w-4 accent-teal-600"
								/>
								<div>
									<p class="text-sm font-semibold text-slate-900">
										Hari {item.dayNumber}: {item.activityTitle}
										<span class="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-600">
											{item.pillar}
										</span>
									</p>
									<p class="text-xs text-slate-600">{item.activityDescription}</p>
								</div>
							</label>
						{/each}
					</div>

					<div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-teal-50 p-4 print:hidden">
						<p class="text-sm font-medium text-teal-900">
							Ingin observasi langsung bersama Psikolog Klinis Anak Harapanku?
						</p>
						<a
							href="/"
							class="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
						>
							Jadwalkan Asesmen di Harapanku &rarr;
						</a>
					</div>
				</div>

				<!-- Sumber Resmi Kemenkes RI -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
					<h3 class="font-heading text-sm font-bold text-slate-900">Referensi Resmi</h3>
					<ul class="mt-3 space-y-2 text-xs text-slate-600">
						{#each OFFICIAL_REFERENCES as ref}
							<li>
								<a href={ref.url} target="_blank" rel="noopener" class="font-semibold text-teal-700 hover:underline">
									{ref.title}
								</a>
								— {ref.description}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	</main>
</div>
