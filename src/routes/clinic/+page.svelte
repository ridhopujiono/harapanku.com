<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Portal Klinis — Klinik Harapanku</title>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-3">
				<img src="/assets/images/logo.png" alt="Harapanku" class="h-9 w-auto" />
				<span class="rounded-full bg-brand-sage-light px-3 py-1 font-subheading text-xs font-bold text-brand-sage-dark">
					Portal Klinis • {data.user?.role === 'psychologist' ? 'Psikolog Klinis' : 'Terapis (STR)'}
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

	<main class="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-2">
		<!-- Kolom Kiri: Psikolog (Buat Therapy Plan) -->
		<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-xl font-bold text-slate-900">
				Asesmen Awal &amp; Susun Therapy Plan
			</h2>
			<p class="mt-1 text-xs text-slate-500">
				Setelah observasi selesai, buat roadmap personal agar Parent Dashboard orang tua aktif.
			</p>

			{#if form?.successPlan}
				<div class="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
					Therapy Plan untuk <strong>{form.childNickname}</strong> ({form.title}) berhasil dibuat!
				</div>
			{/if}

			<form method="POST" action="?/createPlan" use:enhance class="mt-5 space-y-4">
				{#if data.parentUsers.length > 0}
					<div>
						<label for="parentId" class="mb-1 block text-xs font-bold text-slate-700">
							Hubungkan ke Akun Orang Tua
						</label>
						<select
							id="parentId"
							name="parentId"
							class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
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
						required
						placeholder="Contoh: Arka"
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<label for="title" class="mb-1 block text-xs font-bold text-slate-700">
						Judul Program Terapi *
					</label>
					<input
						id="title"
						name="title"
						required
						placeholder="Contoh: Terapi Perilaku (ABA) & Wicara"
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div>
						<label for="speechPct" class="mb-1 block text-xs font-bold text-slate-700">Wicara (%)</label>
						<input id="speechPct" name="speechPct" type="number" min="0" max="100" value="60" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="sensoryPct" class="mb-1 block text-xs font-bold text-slate-700">Sensori (%)</label>
						<input id="sensoryPct" name="sensoryPct" type="number" min="0" max="100" value="65" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="motorPct" class="mb-1 block text-xs font-bold text-slate-700">Motorik (%)</label>
						<input id="motorPct" name="motorPct" type="number" min="0" max="100" value="70" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
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
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<button
					type="submit"
					class="w-full cursor-pointer rounded-xl bg-brand-blue py-2.5 text-xs font-bold text-white hover:bg-brand-blue-dark"
				>
					Simpan Therapy Plan &amp; Aktifkan Dashboard
				</button>
			</form>
		</section>

		<!-- Kolom Kanan: Terapis (Input Daily Therapy Log) -->
		<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-xl font-bold text-slate-900">
				Input Daily Therapy Log
			</h2>
			<p class="mt-1 text-xs text-slate-500">
				Catatan sesi langsung tampil di Parent Dashboard orang tua secara real-time.
			</p>

			{#if form?.successSession}
				<div class="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
					Daily Therapy Log Sesi #{form.sessionNumber} tersimpan!
					{#if form.needsEvaluation}
						<span class="mt-1 block text-amber-800">
							⚠️ Sesi ke-{form.sessionNumber} (kelipatan 12): Saatnya Evaluasi Berkala bersama Psikolog!
						</span>
					{/if}
				</div>
			{/if}

			<form method="POST" action="?/addSession" use:enhance class="mt-5 space-y-4">
				<div class="grid grid-cols-3 gap-3">
					<div class="col-span-2">
						<label for="planId" class="mb-1 block text-xs font-bold text-slate-700">Program Anak *</label>
						<select id="planId" name="planId" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
							{#each data.plans as p}
								<option value={p.id}>{p.childNickname} — {p.title}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="sessionNumber" class="mb-1 block text-xs font-bold text-slate-700">Sesi Ke- *</label>
						<input id="sessionNumber" name="sessionNumber" type="number" min="1" value="1" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
					</div>
				</div>

				<div>
					<label for="stimulationFocus" class="mb-1 block text-xs font-bold text-slate-700">Fokus Stimulasi *</label>
					<textarea
						id="stimulationFocus"
						name="stimulationFocus"
						rows="2"
						required
						placeholder="Contoh: Latihan kontak mata & kepatuhan instruksi 1 langkah"
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
					></textarea>
				</div>

				<div>
					<label for="emotionalResponse" class="mb-1 block text-xs font-bold text-slate-700">Respon Emosional *</label>
					<input
						id="emotionalResponse"
						name="emotionalResponse"
						required
						placeholder="Contoh: Ceria & Sangat Kooperatif"
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
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
						class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
					></textarea>
				</div>

				<button
					type="submit"
					class="w-full cursor-pointer rounded-xl bg-brand-sage py-2.5 text-xs font-bold text-white hover:bg-brand-sage-dark"
				>
					Kirim ke Parent Dashboard
				</button>
			</form>
		</section>
	</main>
</div>
