<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterStatus = $state<'all' | 'pending_wa' | 'confirmed' | 'completed'>('all');
	let activeApptId = $state<string | null>(null);

	let filteredAppointments = $derived(
		filterStatus === 'all'
			? data.appointments
			: data.appointments.filter((a) => a.status === filterStatus)
	);
</script>

<svelte:head>
	<title>Portal Admin — Klinik Harapanku</title>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-3">
				<img src="/assets/images/logo.png" alt="Harapanku" class="h-9 w-auto" />
				<span class="rounded-full bg-brand-blue-light px-3 py-1 font-subheading text-xs font-bold text-brand-blue">
					Portal Admin • Care Coordinator
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

	<main class="mx-auto max-w-6xl px-6 py-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h1 class="font-heading text-2xl font-bold text-slate-900">
					Antrean Reservasi &amp; Aktivasi Akun Parent
				</h1>
				<p class="mt-1 text-sm text-slate-500">
					Konfirmasi jadwal Zero Waiting List (1–3 hari kerja) dan kirim kredensial ke WhatsApp orang tua.
				</p>
			</div>

			<div class="flex gap-2">
				{#each ['all', 'pending_wa', 'confirmed', 'completed'] as st}
					<button
						type="button"
						onclick={() => (filterStatus = st as typeof filterStatus)}
						class="cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold capitalize {filterStatus === st
							? 'bg-brand-blue text-white'
							: 'bg-white text-slate-600 border border-slate-200'}"
					>
						{st === 'all' ? 'Semua' : st.replace('_', ' ')}
					</button>
				{/each}
			</div>
		</div>

		{#if form?.success && form.waConfirmUrl}
			<div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p class="font-bold">
							Jadwal {form.parentName} dikonfirmasi!
							{#if form.tempPassword}
								Kata sandi sementara: <code class="rounded bg-white px-2 py-0.5 font-mono font-bold">{form.tempPassword}</code>
							{/if}
						</p>
						<p class="mt-1 text-xs text-emerald-800">
							Klik tombol di kanan untuk langsung mengirim jadwal &amp; kredensial login ke WhatsApp orang tua.
						</p>
					</div>
					<a
						href={form.waConfirmUrl}
						target="_blank"
						rel="noopener"
						class="rounded-xl bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#20ba59]"
					>
						Kirim Jadwal &amp; Akun ke WA &rarr;
					</a>
				</div>
			</div>
		{/if}

		{#if form?.error}
			<p class="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{form.error}</p>
		{/if}

		<div class="mt-6 space-y-4">
			{#each filteredAppointments as appt (appt.id)}
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-2">
								<span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
									#{appt.id.slice(0, 8).toUpperCase()}
								</span>
								<span
									class="rounded-full px-2.5 py-0.5 text-xs font-bold {appt.status === 'pending_wa'
										? 'bg-amber-100 text-amber-800'
										: appt.status === 'confirmed'
											? 'bg-emerald-100 text-emerald-800'
											: 'bg-slate-100 text-slate-700'}"
								>
									{appt.status}
								</span>
							</div>
							<h3 class="mt-2 font-heading text-lg font-bold text-slate-900">
								{appt.parentName} <span class="text-sm font-normal text-slate-500">({appt.childAgeLabel})</span>
							</h3>
							<p class="text-sm text-slate-600">Keluhan: <strong>{appt.mainComplaint}</strong> • WA: {appt.parentWa}</p>
						</div>

						<button
							type="button"
							onclick={() => (activeApptId = activeApptId === appt.id ? null : appt.id)}
							class="cursor-pointer rounded-xl bg-brand-orange px-4 py-2 text-xs font-bold text-white hover:bg-brand-orange-hover"
						>
							{activeApptId === appt.id ? 'Tutup Form' : 'Konfirmasi & Buat Akun'}
						</button>
					</div>

					{#if activeApptId === appt.id}
						<form
							method="POST"
							action="?/confirmAndCreateAccount"
							use:enhance
							class="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2"
						>
							<input type="hidden" name="appointmentId" value={appt.id} />
							<input type="hidden" name="parentName" value={appt.parentName} />
							<input type="hidden" name="parentWa" value={appt.parentWa} />

							<div>
								<label for="sched-{appt.id}" class="mb-1 block text-xs font-bold text-slate-700">
									Tanggal &amp; Jam Asesmen (WITA) *
								</label>
								<input
									id="sched-{appt.id}"
									name="scheduledAt"
									type="datetime-local"
									required
									class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>

							<div>
								<label for="therapist-{appt.id}" class="mb-1 block text-xs font-bold text-slate-700">
									Tugaskan Psikolog / Terapis
								</label>
								<select
									id="therapist-{appt.id}"
									name="therapistId"
									class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
								>
									{#each data.therapists as t}
										<option value={t.id}>{t.fullName} ({t.specialization})</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="pkg-{appt.id}" class="mb-1 block text-xs font-bold text-slate-700">
									Paket Asesmen
								</label>
								<select
									id="pkg-{appt.id}"
									name="packageId"
									class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
								>
									{#each data.packages as p}
										<option value={p.id}>{p.name}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="notes-{appt.id}" class="mb-1 block text-xs font-bold text-slate-700">
									Catatan Care Coordinator
								</label>
								<input
									id="notes-{appt.id}"
									name="adminNotes"
									placeholder="Catatan ruang observasi / persiapan"
									class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
								/>
							</div>

							<div class="sm:col-span-2">
								<button
									type="submit"
									class="cursor-pointer rounded-xl bg-brand-blue px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-blue-dark"
								>
									Simpan Jadwal &amp; Generate Akun Parent
								</button>
							</div>
						</form>
					{/if}
				</div>
			{/each}
		</div>
	</main>
</div>
