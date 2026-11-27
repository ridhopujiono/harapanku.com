<script lang="ts">
	import DashboardShell, { type NavItem } from '$lib/components/DashboardShell.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeSection = $state<'overview' | 'logs' | 'targets'>('overview');

	let navItems = $derived<NavItem[]>([
		{
			label: 'Ringkasan Progres',
			icon: 'dashboard',
			active: activeSection === 'overview',
			onclick: () => (activeSection = 'overview')
		},
		{
			label: 'Daily Therapy Log',
			icon: 'clinical_notes',
			active: activeSection === 'logs',
			onclick: () => (activeSection = 'logs')
		},
		{
			label: 'Target Bulan Ini',
			icon: 'checklist',
			active: activeSection === 'targets',
			onclick: () => (activeSection = 'targets')
		},
		{
			label: 'Skrining Mandiri',
			icon: 'psychology',
			href: '/skrining'
		}
	]);

	let achievedTargets = $derived(data.targets.filter((t) => t.isAchieved).length);
	let totalTargets = $derived(data.targets.length);
	let targetPct = $derived(totalTargets > 0 ? Math.round((achievedTargets / totalTargets) * 100) : 0);
</script>

<svelte:head>
	<title>Parent Dashboard — Klinik Harapanku</title>
</svelte:head>

<DashboardShell
	title="Parent Dashboard"
	subtitle={data.child ? `Pemantauan Tumbuh Kembang Ananda ${data.child.nickname}` : 'Portal Orang Tua'}
	roleLabel="Orang Tua (Parent)"
	userName={data.user?.fullName ?? 'Orang Tua'}
	{navItems}
>
	{#if !data.plan}
		<div class="rounded-2xl border border-blue-100 bg-white p-10 text-center shadow-xs">
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
				<span class="material-symbols-outlined text-[30px]">event_available</span>
			</div>
			<h2 class="font-heading text-xl font-bold text-slate-900">
				Selamat Datang, {data.user?.fullName}
			</h2>
			<p class="mx-auto mt-2 max-w-lg text-sm text-slate-600">
				Jadwal asesmen Anda telah terkonfirmasi. Setelah Psikolog Klinis selesai menyusun Therapy Plan,
				grafik Milestone Radar dan Daily Therapy Log akan tampil di sini.
			</p>
			<a
				href="/skrining"
				class="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
			>
				<span class="material-symbols-outlined text-[18px]">psychology</span>
				<span>Buka Skrining Mandiri TumbuhKembang.id</span>
			</a>
		</div>
	{:else}
		<!-- Top KPI Summary Row (FMS Style, Strictly White & Blue) -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-slate-500">Ananda &amp; Program</span>
					<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
						<span class="material-symbols-outlined text-[20px]">child_care</span>
					</span>
				</div>
				<p class="mt-3 font-heading text-lg font-bold text-slate-900">{data.child?.nickname}</p>
				<p class="mt-0.5 truncate text-xs font-medium text-blue-700">{data.plan.title}</p>
			</div>

			<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-slate-500">Wicara Ekspresif</span>
					<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
						<span class="material-symbols-outlined text-[20px]">record_voice_over</span>
					</span>
				</div>
				<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">
					{data.snapshot?.speechExpressivePct ?? 0}%
				</p>
				<div class="mt-2 h-1.5 w-full rounded-full bg-blue-50">
					<div
						class="h-1.5 rounded-full bg-blue-600"
						style="width: {data.snapshot?.speechExpressivePct ?? 0}%"
					></div>
				</div>
			</div>

			<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-slate-500">Sensori &amp; Fokus</span>
					<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
						<span class="material-symbols-outlined text-[20px]">neurology</span>
					</span>
				</div>
				<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">
					{data.snapshot?.sensoryFocusPct ?? 0}%
				</p>
				<div class="mt-2 h-1.5 w-full rounded-full bg-blue-50">
					<div
						class="h-1.5 rounded-full bg-blue-500"
						style="width: {data.snapshot?.sensoryFocusPct ?? 0}%"
					></div>
				</div>
			</div>

			<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
				<div class="flex items-center justify-between">
					<span class="text-xs font-semibold text-slate-500">Target Tercapai</span>
					<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
						<span class="material-symbols-outlined text-[20px]">task_alt</span>
					</span>
				</div>
				<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">
					{achievedTargets} / {totalTargets}
				</p>
				<p class="mt-1 text-xs font-medium text-blue-600">
					{targetPct}% target bulanan • Siklus {data.plan.evaluationCycleSessions} sesi
				</p>
			</div>
		</div>

		<!-- Main Workspace Grid -->
		<div class="mt-6 grid gap-6 lg:grid-cols-12">
			{#if activeSection === 'overview' || activeSection === 'logs'}
				<section
					class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs {activeSection === 'logs'
						? 'lg:col-span-12'
						: 'lg:col-span-7'}"
				>
					<div class="flex items-center justify-between border-b border-blue-50 pb-4">
						<div>
							<h2 class="font-heading text-base font-bold text-slate-900">Daily Therapy Log</h2>
							<p class="text-xs text-slate-500">Catatan sesi terapi dan panduan latihan di rumah</p>
						</div>
						<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
							{data.sessions.length} Sesi Tercatat
						</span>
					</div>

					<div class="mt-4 space-y-4">
						{#if data.sessions.length === 0}
							<p class="py-6 text-center text-sm text-slate-500">
								Belum ada catatan sesi terapi. Catatan akan muncul otomatis setelah sesi selesai.
							</p>
						{:else}
							{#each data.sessions as s (s.id)}
								<div class="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
									<div class="flex flex-wrap items-center justify-between gap-2">
										<span class="font-heading text-sm font-bold text-slate-900">
											Sesi #{s.sessionNumber}
										</span>
										<span class="rounded-full border border-blue-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-blue-700">
											{s.emotionalResponse}
										</span>
									</div>
									<p class="mt-2 text-sm text-slate-700">{s.stimulationFocus}</p>
									{#if s.homeRecommendation}
										<div class="mt-3 rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-700">
											<strong class="text-blue-700">Home Stimulation:</strong>
											{s.homeRecommendation}
										</div>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</section>
			{/if}

			{#if activeSection === 'overview' || activeSection === 'targets'}
				<section
					class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs {activeSection === 'targets'
						? 'lg:col-span-12'
						: 'lg:col-span-5'}"
				>
					<div class="flex items-center justify-between border-b border-blue-50 pb-4">
						<div>
							<h2 class="font-heading text-base font-bold text-slate-900">Target Bulan Ini</h2>
							<p class="text-xs text-slate-500">Milestone yang sedang dilatih bersama terapis</p>
						</div>
						<span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
							{targetPct}%
						</span>
					</div>

					<div class="mt-4 space-y-2.5">
						{#if data.targets.length === 0}
							<p class="py-6 text-center text-sm text-slate-500">
								Belum ada target bulanan yang ditetapkan.
							</p>
						{:else}
							{#each data.targets as t (t.id)}
								<div
									class="flex items-start gap-3 rounded-xl border p-3.5 text-sm {t.isAchieved
										? 'border-blue-200 bg-blue-50/60'
										: 'border-slate-200 bg-white'}"
								>
									<span class="material-symbols-outlined mt-0.5 text-[20px] text-blue-600">
										{t.isAchieved ? 'check_circle' : 'radio_button_unchecked'}
									</span>
									<span class={t.isAchieved ? 'font-medium text-blue-900' : 'font-medium text-slate-800'}>
										{t.targetDescription}
									</span>
								</div>
							{/each}
						{/if}
					</div>

					{#if data.snapshot?.summaryNote}
						<div class="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-900">
							<p class="font-bold">Catatan Psikolog Klinis:</p>
							<p class="mt-1 leading-relaxed">{data.snapshot.summaryNote}</p>
						</div>
					{/if}
				</section>
			{/if}
		</div>
	{/if}
</DashboardShell>
