<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Parent Dashboard — Klinik Harapanku</title>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-3">
				<img src="/assets/images/logo.png" alt="Harapanku" class="h-9 w-auto" />
				<span class="rounded-full bg-brand-blue-light px-3 py-1 font-subheading text-xs font-bold text-brand-blue">
					Parent Dashboard
				</span>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-xs font-semibold text-slate-600">{data.user?.fullName}</span>
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
					>
						Keluar
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-5xl space-y-6 px-6 py-8">
		{#if !data.plan}
			<div class="rounded-3xl border border-slate-200 bg-white p-8 text-center">
				<h1 class="font-heading text-xl font-bold text-slate-900">
					Selamat Datang, {data.user?.fullName}
				</h1>
				<p class="mt-2 text-sm text-slate-600">
					Jadwal asesmen Anda telah terkonfirmasi. Setelah Psikolog Klinis selesai menyusun Therapy Plan,
					Milestone Radar dan Daily Therapy Log akan tampil di halaman ini.
				</p>
				<a
					href="/skrining"
					class="mt-5 inline-block rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-bold text-white"
				>
					Buka Skrining Mandiri TumbuhKembang.id
				</a>
			</div>
		{:else}
			<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<h1 class="font-heading text-2xl font-bold text-slate-900">
							Progres Ananda {data.child?.nickname ?? ''}
						</h1>
						<p class="text-sm text-slate-500">{data.plan.title}</p>
					</div>
					<span class="rounded-full bg-brand-sage-light px-3 py-1 text-xs font-bold text-brand-sage-dark">
						Evaluasi tiap {data.plan.evaluationCycleSessions} sesi
					</span>
				</div>

				{#if data.snapshot}
					<div class="mt-6 grid gap-4 sm:grid-cols-3">
						<div class="rounded-2xl bg-[#f8fafc] p-4">
							<p class="text-xs font-semibold text-slate-500">Wicara Ekspresif</p>
							<p class="mt-1 text-2xl font-extrabold text-brand-blue">{data.snapshot.speechExpressivePct}%</p>
						</div>
						<div class="rounded-2xl bg-[#f8fafc] p-4">
							<p class="text-xs font-semibold text-slate-500">Sensori &amp; Fokus</p>
							<p class="mt-1 text-2xl font-extrabold text-brand-sage-dark">{data.snapshot.sensoryFocusPct}%</p>
						</div>
						<div class="rounded-2xl bg-[#f8fafc] p-4">
							<p class="text-xs font-semibold text-slate-500">Motorik Halus</p>
							<p class="mt-1 text-2xl font-extrabold text-brand-orange-dark">{data.snapshot.fineMotorPct}%</p>
						</div>
					</div>
				{/if}
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
					<h2 class="font-heading text-lg font-bold text-slate-900">Daily Therapy Log</h2>
					<div class="mt-4 space-y-3">
						{#each data.sessions as s (s.id)}
							<div class="rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 text-sm">
								<div class="flex items-center justify-between">
									<strong class="text-slate-900">Sesi #{s.sessionNumber}</strong>
									<span class="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
										{s.emotionalResponse}
									</span>
								</div>
								<p class="mt-2 text-xs text-slate-700">{s.stimulationFocus}</p>
								{#if s.homeRecommendation}
									<p class="mt-2 rounded-xl bg-brand-sage-light/60 p-2.5 text-xs text-brand-sage-dark">
										<strong>Home Stimulation:</strong> {s.homeRecommendation}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				</section>

				<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
					<h2 class="font-heading text-lg font-bold text-slate-900">Target Bulan Ini</h2>
					<div class="mt-4 space-y-2.5">
						{#each data.targets as t (t.id)}
							<div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fafc] p-3 text-sm">
								<span class="text-base">{t.isAchieved ? '✅' : '⏳'}</span>
								<span class={t.isAchieved ? 'text-slate-500 line-through' : 'font-medium text-slate-800'}>
									{t.targetDescription}
								</span>
							</div>
						{/each}
					</div>
				</section>
			</div>
		{/if}
	</main>
</div>
