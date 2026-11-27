<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let nowMs = $state(Date.now());

	$effect(() => {
		if (!data.isCountdownMode) return;
		const timer = setInterval(() => {
			nowMs = Date.now();
		}, 1000);
		return () => clearInterval(timer);
	});

	let targetMs = $derived(new Date(data.launchAt).getTime());
	let diffMs = $derived(Math.max(0, targetMs - nowMs));

	let days = $derived(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
	let hours = $derived(Math.floor((diffMs / (1000 * 60 * 60)) % 24));
	let minutes = $derived(Math.floor((diffMs / (1000 * 60)) % 60));
	let seconds = $derived(Math.floor((diffMs / 1000) % 60));

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<svelte:head>
	{#if data.isCountdownMode}
		<title>Segera Hadir — Klinik Tumbuh Kembang Harapanku</title>
	{/if}
</svelte:head>

{#if data.isCountdownMode}
	<main class="flex min-h-screen flex-col items-center justify-center bg-[#F4F8FF] px-4 py-12 text-slate-900">
		<div class="w-full max-w-2xl rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl sm:p-12">
			<img src="/assets/images/logo.png" alt="Harapanku" class="mx-auto h-12 w-auto" />

			<span class="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 font-subheading text-xs font-bold text-blue-700">
				<span class="h-2 w-2 animate-pulse rounded-full bg-blue-600"></span>
				Persiapan Peluncuran Resmi
			</span>

			<h1 class="mt-5 font-heading text-2xl font-extrabold text-slate-900 sm:text-4xl">
				Platform Harapanku Segera Hadir
			</h1>
			<p class="mx-auto mt-3 max-w-lg font-body text-sm leading-relaxed text-slate-600 sm:text-base">
				Sistem terpadu Klinik Tumbuh Kembang Anak &amp; Skrining Mandiri sedang kami siapkan dan
				akan resmi dibuka pada <strong>30 November 2026, pukul 00:00 WITA</strong>.
			</p>

			<!-- Live Countdown -->
			<div class="mt-8 grid grid-cols-4 gap-3 sm:gap-4">
				<div class="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
					<p class="font-heading text-2xl font-extrabold text-blue-700 sm:text-4xl">{pad(days)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-slate-500 uppercase">Hari</p>
				</div>
				<div class="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
					<p class="font-heading text-2xl font-extrabold text-blue-700 sm:text-4xl">{pad(hours)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-slate-500 uppercase">Jam</p>
				</div>
				<div class="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
					<p class="font-heading text-2xl font-extrabold text-blue-700 sm:text-4xl">{pad(minutes)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-slate-500 uppercase">Menit</p>
				</div>
				<div class="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
					<p class="font-heading text-2xl font-extrabold text-blue-700 sm:text-4xl">{pad(seconds)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-slate-500 uppercase">Detik</p>
				</div>
			</div>

			<div class="mt-8 border-t border-blue-50 pt-6">
				<p class="text-xs text-slate-500">
					Butuh konsultasi atau informasi jadwal klinik di Balikpapan?
				</p>
				<a
					href="https://wa.me/628115400992?text=Halo%20Klinik%20Harapanku%2C%20saya%20ingin%20tanya%20informasi%20layanan"
					target="_blank"
					rel="noopener"
					class="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-subheading text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
				>
					<span class="material-symbols-outlined text-[18px]">chat</span>
					<span>Hubungi Care Coordinator via WhatsApp</span>
				</a>
			</div>
		</div>
	</main>
{:else}
	{@render children()}
{/if}
