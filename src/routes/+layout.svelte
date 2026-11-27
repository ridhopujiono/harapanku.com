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
	<main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#F4F8F5] via-[#FAFBF8] to-[#F2F6F3] px-4 py-12 text-slate-900">
		<div class="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#145334]/15 bg-white p-8 text-center shadow-xl sm:p-12">
			<div class="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#145334] via-[#D4A843] to-[#145334]"></div>

			<img src="/assets/images/logo.png" alt="Harapanku" class="mx-auto h-28 w-auto sm:h-36" />

			<span class="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4A843]/40 bg-[#FAF5E8] px-4 py-1 font-subheading text-xs font-bold text-[#9A6F18]">
				<span class="h-2 w-2 animate-pulse rounded-full bg-[#D4A843]"></span>
				Persiapan Peluncuran Resmi
			</span>

			<h1 class="mt-5 font-heading text-2xl font-extrabold text-[#145334] sm:text-4xl">
				Platform Harapanku Segera Hadir
			</h1>
			<p class="mx-auto mt-3 max-w-lg font-body text-sm leading-relaxed text-slate-600 sm:text-base">
				Sistem terpadu Klinik Tumbuh Kembang Anak &amp; Skrining Mandiri sedang kami siapkan dan
				akan resmi dibuka pada <strong class="text-[#B4821E]">30 November 2026, pukul 00:00 WITA</strong>.
			</p>

			<!-- Live Countdown -->
			<div class="mt-8 grid grid-cols-4 gap-3 sm:gap-4">
				<div class="rounded-2xl border border-[#145334]/15 bg-[#F6FAF7] p-4">
					<p class="font-heading text-2xl font-extrabold text-[#145334] sm:text-4xl">{pad(days)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-[#9A6F18] uppercase">Hari</p>
				</div>
				<div class="rounded-2xl border border-[#145334]/15 bg-[#F6FAF7] p-4">
					<p class="font-heading text-2xl font-extrabold text-[#145334] sm:text-4xl">{pad(hours)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-[#9A6F18] uppercase">Jam</p>
				</div>
				<div class="rounded-2xl border border-[#145334]/15 bg-[#F6FAF7] p-4">
					<p class="font-heading text-2xl font-extrabold text-[#145334] sm:text-4xl">{pad(minutes)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-[#9A6F18] uppercase">Menit</p>
				</div>
				<div class="rounded-2xl border border-[#D4A843]/35 bg-[#FDF9EE] p-4">
					<p class="font-heading text-2xl font-extrabold text-[#B4821E] sm:text-4xl">{pad(seconds)}</p>
					<p class="mt-1 font-subheading text-[11px] font-bold tracking-wider text-[#145334] uppercase">Detik</p>
				</div>
			</div>

			<div class="mt-8 border-t border-slate-100 pt-6">
				<p class="text-xs text-slate-500">
					Butuh konsultasi atau informasi jadwal klinik di Balikpapan?
				</p>
				<a
					href="https://wa.me/628115400992?text=Halo%20Klinik%20Harapanku%2C%20saya%20ingin%20tanya%20informasi%20layanan"
					target="_blank"
					rel="noopener"
					class="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#145334] px-6 py-3 font-subheading text-sm font-bold text-white shadow-sm transition hover:bg-[#0F3F27]"
				>
					<span class="material-symbols-outlined text-[18px] text-[#E5C158]">chat</span>
					<span>Hubungi Care Coordinator via WhatsApp</span>
				</a>
			</div>
		</div>
	</main>
{:else}
	{@render children()}
{/if}
