<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		calculateDenverAges,
		type AnswerStatus,
		type PillarType
	} from '$lib/utils/screening';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let step = $state<1 | 2 | 3>(1);

	// Step 1 state
	let nickname = $state('Arka');
	let birthDate = $state('2023-04-15');
	let isPremature = $state(false);
	let gestationalWeeks = $state(33);
	let primaryConcerns = $state<string[]>(['Cek rutin berkala']);

	const concernOptions = [
		'🗣️ Belum bicara lancar (Speech delay)',
		'👀 Sulit kontak mata / respons nama',
		'🔊 Sensitif suara keras / tekstur baju',
		'💥 Sering tantrum intens / sulit transisi',
		'📋 Cek rutin berkala (Milestone Check)'
	];

	let agePreview = $derived(calculateDenverAges(birthDate, isPremature, gestationalWeeks));

	// Step 2 state
	let currentIdx = $state(0);
	let answers = $state<Record<number, { status: AnswerStatus; usedMiniGame: boolean }>>({});
	let showMiniGame = $state(false);
	let timerSeconds = $state(60);
	let timerRunning = $state(false);
	let timerHandle = $state<ReturnType<typeof setInterval> | null>(null);
	let validationMsg = $state('');
	let isSubmitting = $state(false);

	let currentQuestion = $derived(data.questions[currentIdx]);
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

	function toggleConcern(label: string) {
		if (primaryConcerns.includes(label)) {
			primaryConcerns = primaryConcerns.filter((c) => c !== label);
		} else {
			primaryConcerns = [...primaryConcerns, label];
		}
	}

	function selectAnswer(status: AnswerStatus, usedMiniGame = false) {
		if (!currentQuestion) return;
		answers = {
			...answers,
			[currentQuestion.id]: {
				status,
				usedMiniGame: usedMiniGame || Boolean(answers[currentQuestion.id]?.usedMiniGame)
			}
		};
		validationMsg = '';
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

	function nextQuestion() {
		if (!currentQuestion || !answers[currentQuestion.id]) {
			validationMsg = 'Silakan pilih salah satu opsi jawaban sebelum melanjutkan.';
			return;
		}
		validationMsg = '';
		showMiniGame = false;
		resetTimer();
		if (currentIdx < data.questions.length - 1) {
			currentIdx += 1;
		}
	}

	function prevQuestion() {
		validationMsg = '';
		showMiniGame = false;
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
			primaryConcerns,
			answers: data.questions
				.filter((q) => answers[q.id])
				.map((q) => ({
					questionId: q.id,
					pillar: q.pillar,
					status: answers[q.id].status,
					isCritical: q.isCriticalIndicator,
					usedMiniGame: answers[q.id].usedMiniGame
				}))
		})
	);

	let completedLogsCount = $derived(Object.values(localCompleted).filter(Boolean).length);
</script>

<svelte:head>
	<title>TumbuhKembang.id — Skrining Tumbuh Kembang Pediatrik Empatik</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900">
	<header class="border-b border-teal-100 bg-white print:hidden">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
			<a href="/" class="flex items-center gap-2 font-bold text-teal-800">
				<span>🌱 TumbuhKembang.id</span>
			</a>
			<span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
				Mode Aman &amp; Rahasia
			</span>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
		<!-- Progress Header -->
		<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
			<div class="flex items-center justify-between text-xs font-semibold text-slate-600">
				<span>
					{step === 1
						? 'Langkah 1 dari 3: Identitas & Usia Koreksi'
						: step === 2
							? `Langkah 2 dari 3: Pertanyaan ${currentIdx + 1} dari ${data.questions.length}`
							: 'Langkah 3 dari 3: Hasil 3 Pilar & Roadmap 14 Hari'}
				</span>
				<span class="text-teal-700">{step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</span>
			</div>
			<div class="mt-2 h-2 w-full rounded-full bg-slate-100">
				<div
					class="h-2 rounded-full bg-teal-600 transition-all"
					style="width: {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}"
				></div>
			</div>
		</div>

		{#if step === 1}
			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<span class="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
					Denver II &amp; M-CHAT-R/F Integrated Engine
				</span>
				<h1 class="mt-3 text-2xl font-bold text-slate-900">
					Kenali Kebutuhan Tumbuh Kembang si Kecil
				</h1>
				<p class="mt-1 text-sm text-slate-600">
					Pendekatan empatik &amp; non-stigmatisasi untuk membantu orang tua memetakan stimulasi di
					rumah.
				</p>

				<div class="mt-6 space-y-5">
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
								<span class="block text-slate-500">Usia Koreksi Denver II</span>
								<strong class="text-teal-700">{agePreview.correctedLabel}</strong>
							</div>
						</div>
					</div>

					<div>
						<p class="text-sm font-semibold text-slate-700">Fokus Perhatian Utama</p>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each concernOptions as opt}
								<button
									type="button"
									onclick={() => toggleConcern(opt)}
									class="rounded-xl border px-3 py-2 text-xs font-medium transition {primaryConcerns.includes(
										opt
									)
										? 'border-teal-600 bg-teal-50 text-teal-900'
										: 'border-slate-200 bg-white text-slate-600'}"
								>
									{opt}
								</button>
							{/each}
						</div>
					</div>

					<button
						type="button"
						onclick={() => {
							if (!nickname.trim() || !birthDate) return;
							step = 2;
						}}
						class="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white hover:bg-teal-700"
					>
						Mulai Skrining Mandiri (8 Pertanyaan) &rarr;
					</button>
				</div>
			</div>
		{:else if step === 2 && currentQuestion}
			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
				<div class="flex items-center justify-between text-xs font-semibold">
					<span class="rounded-full bg-teal-50 px-3 py-1 uppercase text-teal-800">
						{currentQuestion.sourceStandard} • {currentQuestion.pillar}
					</span>
					<span class="text-slate-500">
						{currentIdx + 1} / {data.questions.length}
					</span>
				</div>

				<h2 class="mt-4 text-xl font-bold text-slate-900">
					{currentQuestion.questionTemplate.replaceAll('{nickname}', nickname || 'si Kecil')}
				</h2>

				<div class="mt-4 rounded-2xl bg-amber-50/80 p-4 text-sm text-amber-950">
					<p class="font-semibold">💡 Contoh Konkret di Rumah</p>
					<p class="mt-1">
						{currentQuestion.homeExample.replaceAll('{nickname}', nickname || 'si Kecil')}
					</p>
				</div>

				<div class="mt-6 space-y-2.5">
					<button
						type="button"
						onclick={() => selectAnswer('optimal')}
						class="w-full rounded-xl border p-3.5 text-left text-sm font-medium transition {currentAnswer?.status ===
						'optimal'
							? 'border-emerald-600 bg-emerald-50 text-emerald-900'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						(A) Sering / Sudah Mahir — <em>Optimal</em>
					</button>
					<button
						type="button"
						onclick={() => selectAnswer('stimulasi')}
						class="w-full rounded-xl border p-3.5 text-left text-sm font-medium transition {currentAnswer?.status ===
						'stimulasi'
							? 'border-amber-600 bg-amber-50 text-amber-900'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						(B) Terkadang / Masih Butuh Bantuan — <em>Perlu Stimulasi</em>
					</button>
					<button
						type="button"
						onclick={() => selectAnswer('perlu_pantauan')}
						class="w-full rounded-xl border p-3.5 text-left text-sm font-medium transition {currentAnswer?.status ===
						'perlu_pantauan'
							? 'border-rose-600 bg-rose-50 text-rose-900'
							: 'border-slate-200 hover:bg-slate-50'}"
					>
						(C) Belum Terlihat — <em>Perlu Pantauan</em>
					</button>
					<button
						type="button"
						onclick={() => (showMiniGame = !showMiniGame)}
						class="w-full rounded-xl border border-dashed border-teal-400 bg-teal-50/40 p-3.5 text-left text-sm font-semibold text-teal-800 hover:bg-teal-50"
					>
						(?) Ragu / Ingin Coba Tes Dulu Bersama si Kecil (Panduan Mini-Game 60 Detik)
					</button>
				</div>

				{#if showMiniGame && currentQuestion.miniGameSteps}
					<div class="mt-4 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
						<div class="flex items-center justify-between">
							<p class="font-bold text-teal-900">🎮 {currentQuestion.miniGameTitle}</p>
							<span class="rounded-lg bg-white px-2.5 py-1 font-mono text-sm font-bold text-teal-800">
								{timerSeconds}d
							</span>
						</div>
						<p class="mt-1 text-xs text-teal-800">
							Alat: {currentQuestion.miniGameSteps.materials}
						</p>
						<ol class="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-700">
							{#each currentQuestion.miniGameSteps.steps as s}
								<li>{s}</li>
							{/each}
						</ol>
						<div class="mt-3 flex flex-wrap gap-2">
							<button
								type="button"
								onclick={startTimer}
								class="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
							>
								{timerRunning ? '⏸ Jeda Stopwatch' : '⏱️ Mulai Stopwatch 60 Detik'}
							</button>
							<button
								type="button"
								onclick={resetTimer}
								class="rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800"
							>
								Reset
							</button>
							<button
								type="button"
								onclick={() => selectAnswer('optimal', true)}
								class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
							>
								Hasil: Mahir
							</button>
							<button
								type="button"
								onclick={() => selectAnswer('stimulasi', true)}
								class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
							>
								Hasil: Terkadang
							</button>
						</div>
					</div>
				{/if}

				{#if validationMsg}
					<p class="mt-3 text-xs font-semibold text-rose-600">{validationMsg}</p>
				{/if}

				<div class="mt-6 flex items-center justify-between gap-3">
					<button
						type="button"
						onclick={prevQuestion}
						class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
					>
						&larr; Kembali
					</button>

					{#if currentIdx < data.questions.length - 1}
						<button
							type="button"
							onclick={nextQuestion}
							class="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
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
								class="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
							>
								{isSubmitting ? 'Menghitung Hasil...' : 'Lihat Hasil & Roadmap ➔'}
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
							<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
								Evaluasi Selesai
							</span>
							<h1 class="mt-2 text-2xl font-bold text-slate-900">
								Ringkasan Perkembangan {form.result.nickname}
							</h1>
							<p class="mt-1 text-xs text-slate-500">
								Usia Kronologis: {form.result.ageInfo.chronologicalLabel} • Usia Koreksi:
								{form.result.ageInfo.correctedLabel}
							</p>
						</div>
						<button
							type="button"
							onclick={() => window.print()}
							class="rounded-xl border border-teal-600 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 print:hidden"
						>
							📄 Unduh / Cetak Laporan (PDF)
						</button>
					</div>

					<p class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
						<strong>Kesimpulan Klinis:</strong> {form.result.scores.clinicalSummary}
					</p>

					<!-- 3 Pilar -->
					<div class="mt-6 grid gap-4 sm:grid-cols-3">
						<div class="rounded-2xl border border-slate-200 p-4">
							<p class="text-xs font-semibold text-slate-500">Wicara &amp; Bahasa</p>
							<p class="mt-1 text-2xl font-extrabold text-teal-700">
								{form.result.scores.scoreWicara}%
							</p>
							<div class="mt-2 h-2 rounded-full bg-slate-100">
								<div
									class="h-2 rounded-full bg-teal-600"
									style="width: {form.result.scores.scoreWicara}%"
								></div>
							</div>
						</div>
						<div class="rounded-2xl border border-slate-200 p-4">
							<p class="text-xs font-semibold text-slate-500">Okupasi &amp; Sensori</p>
							<p class="mt-1 text-2xl font-extrabold text-teal-700">
								{form.result.scores.scoreOkupasi}%
							</p>
							<div class="mt-2 h-2 rounded-full bg-slate-100">
								<div
									class="h-2 rounded-full bg-teal-500"
									style="width: {form.result.scores.scoreOkupasi}%"
								></div>
							</div>
						</div>
						<div class="rounded-2xl border border-slate-200 p-4">
							<p class="text-xs font-semibold text-slate-500">Perilaku &amp; Interaksi</p>
							<p class="mt-1 text-2xl font-extrabold text-teal-700">
								{form.result.scores.scorePerilaku}%
							</p>
							<div class="mt-2 h-2 rounded-full bg-slate-100">
								<div
									class="h-2 rounded-full bg-emerald-500"
									style="width: {form.result.scores.scorePerilaku}%"
								></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Roadmap 14 Hari -->
				<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h2 class="text-lg font-bold text-slate-900">
								Roadmap Stimulasi Mandiri 14 Hari (Tanpa Layar)
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
									class="rounded-lg px-2.5 py-1 text-xs font-semibold capitalize {roadmapFilter ===
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
							Ingin hasil skrining ini ditinjau oleh Psikolog Klinis Harapanku?
						</p>
						<a
							href="/"
							class="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
						>
							Jadwalkan Asesmen di Harapanku &rarr;
						</a>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
