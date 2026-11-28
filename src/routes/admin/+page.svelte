<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let filterStatus = $state<'all' | 'pending_wa' | 'confirmed' | 'completed'>('all');
	let activeApptId = $state<string | null>(null);

	let filteredAppointments = $derived(
		filterStatus === 'all'
			? data.appointments
			: data.appointments.filter((a) => a.status === filterStatus)
	);

	let pendingCount = $derived(data.appointments.filter((a) => a.status === 'pending_wa').length);
	let confirmedCount = $derived(data.appointments.filter((a) => a.status === 'confirmed').length);

	const navItems = getAdminNavItems('/admin');
</script>

<svelte:head>
	<title>Portal Admin — Klinik Harapanku</title>
</svelte:head>

<DashboardShell
	title="Antrean Reservasi &amp; Aktivasi Akun"
	subtitle="Konfirmasi jadwal Zero Waiting List (1–3 hari kerja) dan kirim kredensial ke WhatsApp orang tua"
	roleLabel="Admin • Care Coordinator"
	userName={data.user?.fullName ?? 'Admin Klinik'}
	{navItems}
>
	<!-- KPI Summary Cards -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Total Reservasi</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">calendar_month</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-slate-900">{data.appointments.length}</p>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Menunggu WA (Pending)</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">schedule</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">{pendingCount}</p>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Jadwal Terkonfirmasi</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">check_circle</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">{confirmedCount}</p>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Staf Klinis Aktif</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">medical_services</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-slate-900">{data.therapists.length}</p>
		</div>
	</div>

	{#if form?.success && form.waConfirmUrl}
		<div class="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-slate-900">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p class="font-bold text-blue-900">
						Jadwal {form.parentName} dikonfirmasi!
						{#if form.tempPassword}
							Kata sandi sementara:
							<code class="ml-1 rounded-lg border border-blue-200 bg-white px-2.5 py-0.5 font-mono font-bold text-blue-700">
								{form.tempPassword}
							</code>
						{/if}
					</p>
					<p class="mt-1 text-xs text-blue-800">
						Klik tombol di kanan untuk langsung mengirim jadwal &amp; kredensial login ke WhatsApp orang tua.
					</p>
				</div>
				<a
					href={form.waConfirmUrl}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
				>
					<span class="material-symbols-outlined text-[16px]">send</span>
					<span>Kirim Jadwal &amp; Akun ke WA</span>
				</a>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<p class="mt-4 rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-blue-700">
			{form.error}
		</p>
	{/if}

	<!-- Appointment Table / List -->
	<div class="mt-6 rounded-2xl border border-blue-100 bg-white shadow-xs">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 px-6 py-4">
			<h2 class="font-heading text-base font-bold text-slate-900">Daftar Antrean Reservasi</h2>
			<div class="flex flex-wrap gap-1.5">
				{#each ['all', 'pending_wa', 'confirmed', 'completed'] as st}
					<button
						type="button"
						onclick={() => (filterStatus = st as typeof filterStatus)}
						class="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition {filterStatus === st
							? 'bg-blue-600 text-white'
							: 'bg-blue-50 text-blue-700 hover:bg-blue-100'}"
					>
						{st === 'all' ? 'Semua' : st.replace('_', ' ')}
					</button>
				{/each}
			</div>
		</div>

		<div class="divide-y divide-blue-50">
			{#if filteredAppointments.length === 0}
				<p class="p-8 text-center text-sm text-slate-500">Tidak ada data reservasi untuk filter ini.</p>
			{:else}
				{#each filteredAppointments as appt (appt.id)}
					<div class="p-6">
						<div class="flex flex-wrap items-start justify-between gap-4">
							<div>
								<div class="flex items-center gap-2">
									<span class="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
										#{appt.id.slice(0, 8).toUpperCase()}
									</span>
									<span
										class="rounded-full px-2.5 py-0.5 text-xs font-bold {appt.status === 'confirmed'
											? 'bg-blue-600 text-white'
											: 'border border-blue-200 bg-white text-blue-700'}"
									>
										{appt.status}
									</span>
								</div>
								<h3 class="mt-2 font-heading text-base font-bold text-slate-900">
									{appt.parentName}
									<span class="text-sm font-normal text-slate-500">({appt.childAgeLabel})</span>
								</h3>
								<p class="mt-0.5 text-xs text-slate-600">
									Keluhan: <strong>{appt.mainComplaint}</strong> • WA: {appt.parentWa}
								</p>
							</div>

							<button
								type="button"
								onclick={() => (activeApptId = activeApptId === appt.id ? null : appt.id)}
								class="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition {activeApptId === appt.id
									? 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
									: 'bg-blue-600 text-white hover:bg-blue-700'}"
							>
								{activeApptId === appt.id ? 'Tutup Form' : 'Konfirmasi & Buat Akun'}
							</button>
						</div>

						{#if activeApptId === appt.id}
							<form
								method="POST"
								action="?/confirmAndCreateAccount"
								use:enhance
								class="mt-5 grid gap-4 rounded-2xl border border-blue-100 bg-[#F8FBFF] p-5 sm:grid-cols-2"
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
										class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
									/>
								</div>

								<div>
									<label for="therapist-{appt.id}" class="mb-1 block text-xs font-bold text-slate-700">
										Tugaskan Psikolog / Terapis
									</label>
									<select
										id="therapist-{appt.id}"
										name="therapistId"
										class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
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
										class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
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
										class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
									/>
								</div>

								<div class="sm:col-span-2">
									<button
										type="submit"
										class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
									>
										Simpan Jadwal &amp; Generate Akun Parent
									</button>
								</div>
							</form>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</DashboardShell>
