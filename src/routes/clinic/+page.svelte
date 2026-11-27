<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell, { type NavItem } from '$lib/components/DashboardShell.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeSection = $state<'all' | 'plan' | 'session'>('all');
	let selectedAppointmentId = $state('');
	let selectedParentId = $state('');
	let planTitle = $state('');
	let childNicknameInput = $state('');

	function selectAppointmentForAssessment(appt: PageData['confirmedAppointments'][number]) {
		selectedAppointmentId = appt.id;
		selectedParentId = appt.matchedParentId ?? '';
		planTitle = appt.mainComplaint;
		activeSection = 'plan';
	}

	let navItems = $derived<NavItem[]>([
		{
			label: 'Ringkasan Klinis',
			icon: 'dashboard',
			active: activeSection === 'all',
			onclick: () => (activeSection = 'all')
		},
		{
			label: 'Susun Therapy Plan',
			icon: 'assignment',
			active: activeSection === 'plan',
			onclick: () => (activeSection = 'plan')
		},
		{
			label: 'Input Daily Log',
			icon: 'edit_note',
			active: activeSection === 'session',
			onclick: () => (activeSection = 'session')
		}
	]);
</script>

<svelte:head>
	<title>Portal Klinis — Klinik Harapanku</title>
</svelte:head>

<DashboardShell
	title="Portal Klinis Psikolog &amp; Terapis"
	subtitle="Penyusunan roadmap asesmen awal, pencatatan Daily Therapy Log, dan evaluasi 12 sesi"
	roleLabel={data.user?.role === 'psychologist' ? 'Psikolog Klinis (HIMPSI)' : 'Terapis (STR)'}
	userName={data.user?.fullName ?? 'Tim Klinis'}
	{navItems}
>
	<!-- KPI Summary Row -->
	<div class="grid gap-4 sm:grid-cols-3">
		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Jadwal Asesmen Terkonfirmasi</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">event_note</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-blue-700">
				{data.confirmedAppointments.length}
			</p>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Therapy Plan Aktif</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">folder_shared</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-slate-900">{data.plans.length}</p>
		</div>

		<div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-xs">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold text-slate-500">Akun Orang Tua Terdaftar</span>
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
					<span class="material-symbols-outlined text-[20px]">group</span>
				</span>
			</div>
			<p class="mt-3 font-heading text-2xl font-extrabold text-slate-900">{data.parentUsers.length}</p>
		</div>
	</div>

	<!-- Daftar Pasien Siap Asesmen (Terkonfirmasi dari Admin) -->
	<section class="mt-6 rounded-2xl border border-blue-100 bg-white shadow-xs">
		<div class="flex items-center justify-between border-b border-blue-50 px-6 py-4">
			<div>
				<h2 class="font-heading text-base font-bold text-slate-900">
					Pasien Menunggu Asesmen (Dari Admin)
				</h2>
				<p class="text-xs text-slate-500">
					Klik "Proses Asesmen" untuk mengisi form Therapy Plan secara otomatis dari jadwal pasien
				</p>
			</div>
			<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
				{data.confirmedAppointments.length} Pasien
			</span>
		</div>

		<div class="divide-y divide-blue-50">
			{#if data.confirmedAppointments.length === 0}
				<p class="p-6 text-center text-sm text-slate-500">
					Belum ada pasien yang dikonfirmasi oleh Admin.
				</p>
			{:else}
				{#each data.confirmedAppointments as appt (appt.id)}
					<div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
						<div>
							<div class="flex items-center gap-2">
								<span class="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
									#{appt.id.slice(0, 8).toUpperCase()}
								</span>
								<span class="text-sm font-bold text-slate-900">
									Orang Tua: {appt.parentName}
								</span>
								<span class="text-xs text-slate-500">({appt.childAgeLabel})</span>
							</div>
							<p class="mt-1 text-xs text-slate-600">
								Keluhan: <strong>{appt.mainComplaint}</strong> • WA: {appt.parentWa}
								{#if appt.scheduledAt}
									• Jadwal: {new Date(appt.scheduledAt).toLocaleString('id-ID', {
										dateStyle: 'medium',
										timeStyle: 'short'
									})}
								{/if}
							</p>
						</div>

						<button
							type="button"
							onclick={() => selectAppointmentForAssessment(appt)}
							class="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
						>
							Proses Asesmen &rarr;
						</button>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		{#if activeSection === 'all' || activeSection === 'plan'}
			<section
				class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs {activeSection === 'plan'
					? 'lg:col-span-2'
					: ''}"
			>
				<div class="border-b border-blue-50 pb-4">
					<h2 class="font-heading text-base font-bold text-slate-900">
						Asesmen Awal &amp; Susun Therapy Plan
					</h2>
					<p class="mt-0.5 text-xs text-slate-500">
						Buat roadmap personal agar Parent Dashboard orang tua aktif.
					</p>
				</div>

				{#if form?.successPlan}
					<div class="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-800">
						Therapy Plan untuk <strong>{form.childNickname}</strong> ({form.title}) berhasil dibuat!
					</div>
				{/if}

				<form method="POST" action="?/createPlan" use:enhance class="mt-5 space-y-4">
					<input type="hidden" name="appointmentId" value={selectedAppointmentId} />
					{#if data.parentUsers.length > 0}
						<div>
							<label for="parentId" class="mb-1 block text-xs font-bold text-slate-700">
								Hubungkan ke Akun Orang Tua
							</label>
							<select
								id="parentId"
								name="parentId"
								bind:value={selectedParentId}
								class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
							>
								<option value="">-- Pilih Orang Tua --</option>
								{#each data.parentUsers as pu}
									<option value={pu.id}>{pu.fullName} ({pu.phoneWa})</option>
								{/each}
							</select>
						</div>
					{/if}

					<div>
						<label for="childNickname" class="mb-1 block text-xs font-bold text-slate-700">
							Nama Panggilan Anak *
						</label>
						<input
							id="childNickname"
							name="childNickname"
							bind:value={childNicknameInput}
							required
							placeholder="Contoh: Arka"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>

					<div>
						<label for="title" class="mb-1 block text-xs font-bold text-slate-700">
							Judul Program Terapi *
						</label>
						<input
							id="title"
							name="title"
							bind:value={planTitle}
							required
							placeholder="Contoh: Terapi Perilaku (ABA) & Wicara"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>

					<div class="grid grid-cols-3 gap-3">
						<div>
							<label for="speechPct" class="mb-1 block text-xs font-bold text-slate-700">Wicara (%)</label>
							<input
								id="speechPct"
								name="speechPct"
								type="number"
								min="0"
								max="100"
								value="60"
								class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
							/>
						</div>
						<div>
							<label for="sensoryPct" class="mb-1 block text-xs font-bold text-slate-700">Sensori (%)</label>
							<input
								id="sensoryPct"
								name="sensoryPct"
								type="number"
								min="0"
								max="100"
								value="65"
								class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
							/>
						</div>
						<div>
							<label for="motorPct" class="mb-1 block text-xs font-bold text-slate-700">Motorik (%)</label>
							<input
								id="motorPct"
								name="motorPct"
								type="number"
								min="0"
								max="100"
								value="70"
								class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
							/>
						</div>
					</div>

					<div>
						<label for="targetDesc" class="mb-1 block text-xs font-bold text-slate-700">
							Target Bulan Pertama
						</label>
						<input
							id="targetDesc"
							name="targetDesc"
							placeholder="Contoh: Merespons panggilan nama dalam < 3 detik"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>

					<button
						type="submit"
						class="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
					>
						Simpan Therapy Plan &amp; Aktifkan Dashboard
					</button>
				</form>
			</section>
		{/if}

		{#if activeSection === 'all' || activeSection === 'session'}
			<section
				class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs {activeSection === 'session'
					? 'lg:col-span-2'
					: ''}"
			>
				<div class="border-b border-blue-50 pb-4">
					<h2 class="font-heading text-base font-bold text-slate-900">Input Daily Therapy Log</h2>
					<p class="mt-0.5 text-xs text-slate-500">
						Catatan sesi langsung tampil di Parent Dashboard orang tua secara real-time.
					</p>
				</div>

				{#if form?.successSession}
					<div class="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-800">
						Daily Therapy Log Sesi #{form.sessionNumber} tersimpan!
						{#if form.needsEvaluation}
							<span class="mt-1 block text-blue-900">
								Sesi ke-{form.sessionNumber} (kelipatan 12): Saatnya Evaluasi Berkala bersama Psikolog!
							</span>
						{/if}
					</div>
				{/if}

				<form method="POST" action="?/addSession" use:enhance class="mt-5 space-y-4">
					<div class="grid grid-cols-3 gap-3">
						<div class="col-span-2">
							<label for="planId" class="mb-1 block text-xs font-bold text-slate-700">Program Anak *</label>
							<select
								id="planId"
								name="planId"
								class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
							>
								{#each data.plans as p}
									<option value={p.id}>{p.childNickname} — {p.title}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="sessionNumber" class="mb-1 block text-xs font-bold text-slate-700">Sesi Ke- *</label>
							<input
								id="sessionNumber"
								name="sessionNumber"
								type="number"
								min="1"
								value="1"
								class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
							/>
						</div>
					</div>

					<div>
						<label for="stimulationFocus" class="mb-1 block text-xs font-bold text-slate-700">
							Fokus Stimulasi *
						</label>
						<textarea
							id="stimulationFocus"
							name="stimulationFocus"
							rows="2"
							required
							placeholder="Contoh: Latihan kontak mata & kepatuhan instruksi 1 langkah"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						></textarea>
					</div>

					<div>
						<label for="emotionalResponse" class="mb-1 block text-xs font-bold text-slate-700">
							Respon Emosional *
						</label>
						<input
							id="emotionalResponse"
							name="emotionalResponse"
							required
							placeholder="Contoh: Ceria & Sangat Kooperatif"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>

					<div>
						<label for="homeRecommendation" class="mb-1 block text-xs font-bold text-slate-700">
							Rekomendasi Latihan di Rumah (Home Stimulation)
						</label>
						<textarea
							id="homeRecommendation"
							name="homeRecommendation"
							rows="2"
							placeholder="Panduan singkat untuk Ayah/Bunda di rumah"
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
					>
						Kirim ke Parent Dashboard
					</button>
				</form>
			</section>
		{/if}
	</div>
</DashboardShell>
