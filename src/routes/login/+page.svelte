<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Masuk Portal — Klinik Harapanku</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 py-12">
	<a href="/" class="mb-6 flex items-center gap-2">
		<img src="/assets/images/logo.png" alt="Harapanku" class="h-11 w-auto" />
	</a>

	<div class="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-xl sm:p-8">
		<div class="mb-5">
			<h1 class="font-heading text-2xl font-extrabold text-slate-900">Masuk Portal Harapanku</h1>
			<p class="mt-1 font-body text-sm text-slate-500">
				Gunakan Nomor WhatsApp dan kata sandi yang dikirimkan oleh Care Coordinator kami.
			</p>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
			class="space-y-4"
		>
			<div>
				<label for="phoneWa" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
					Nomor WhatsApp Aktif
				</label>
				<input
					id="phoneWa"
					name="phoneWa"
					type="tel"
					required
					placeholder="082257802227"
					class="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-body text-sm text-slate-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
					Kata Sandi
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					placeholder="••••••••"
					class="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-body text-sm text-slate-800 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
				/>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full cursor-pointer rounded-xl bg-brand-blue py-3 font-subheading text-sm font-bold text-white shadow-md transition-all hover:bg-brand-blue-dark disabled:opacity-60"
			>
				{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Portal'}
			</button>
		</form>

		<div class="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
			<p class="font-bold text-slate-800">Akun Demo Lokal (jika MySQL belum aktif):</p>
			<ul class="mt-1.5 space-y-1 font-mono text-[11px]">
				<li>Admin: 08115400001 / harapanku123</li>
				<li>Psikolog: 08115400002 / harapanku123</li>
				<li>Terapis: 08115400003 / harapanku123</li>
				<li>Parent: 082257802227 / harapanku123</li>
			</ul>
		</div>

		<div class="mt-5 text-center">
			<a href="/" class="font-subheading text-xs font-semibold text-brand-blue hover:underline">
				&larr; Kembali ke Beranda Harapanku
			</a>
		</div>
	</div>
</main>
