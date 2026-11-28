<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const navItems = getAdminNavItems('/admin/cms/packages');

	let editingId = $state<number | null>(null);
	let showCreateForm = $state(false);

	function formatRupiah(n: number) {
		return new Intl.NumberFormat('id-ID').format(n);
	}
</script>

<svelte:head>
	<title>CMS Paket &amp; Investasi — Admin Harapanku</title>
</svelte:head>

<DashboardShell
	title="CMS: Paket Asesmen &amp; Investasi"
	subtitle="Kelola judul Investasi Tumbuh Kembang, Banner Cek Mandiri, dan CRUD Paket Screening"
	roleLabel="Admin • Care Coordinator"
	userName={data.user?.fullName ?? 'Admin Klinik'}
	{navItems}
>
	{#if form?.error}
		<div class="mb-4 rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-blue-800">
			{form.error}
		</div>
	{/if}
	{#if form?.successMsg}
		<div class="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
			{form.successMsg}
		</div>
	{/if}

	<!-- 9. Investasi Tumbuh Kembang & Banner Skrining -->
	<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<h2 class="font-heading text-base font-bold text-slate-900">
			9. Section Investasi Tumbuh Kembang &amp; Banner Cek Mandiri
		</h2>
		<form method="POST" action="?/saveInvestment" use:enhance class="mt-4 grid gap-3 sm:grid-cols-2">
			<div>
				<label for="inv-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
				<input id="inv-badge" name="badge" value={data.investment.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div>
				<label for="inv-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
				<input id="inv-title" name="title" value={data.investment.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<label for="inv-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
				<input id="inv-sub" name="subtitle" value={data.investment.subtitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div>
				<label for="inv-ct" class="mb-1 block text-xs font-bold text-slate-700">Judul Banner Skrining</label>
				<input id="inv-ct" name="calloutTitle" value={data.investment.calloutTitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div>
				<label for="inv-cb" class="mb-1 block text-xs font-bold text-slate-700">Badge Banner Skrining</label>
				<input id="inv-cb" name="calloutBadge" value={data.investment.calloutBadge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<label for="inv-cd" class="mb-1 block text-xs font-bold text-slate-700">Deskripsi Banner Skrining</label>
				<textarea id="inv-cd" name="calloutDescription" rows="2" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.investment.calloutDescription}</textarea>
			</div>
			<div>
				<label for="inv-btn" class="mb-1 block text-xs font-bold text-slate-700">Teks Tombol Banner</label>
				<input id="inv-btn" name="calloutButton" value={data.investment.calloutButton} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Section Investasi
				</button>
			</div>
		</form>
	</section>

	<!-- 10. CRUD Paket Asesmen / Screening -->
	<section class="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 pb-4">
			<div>
				<h2 class="font-heading text-base font-bold text-slate-900">
					10. Daftar Paket Screening &amp; Asesmen ({data.packages.length})
				</h2>
				<p class="text-xs text-slate-500">Data tersimpan langsung di tabel MySQL assessment_packages</p>
			</div>
			<button
				type="button"
				onclick={() => (showCreateForm = !showCreateForm)}
				class="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
			>
				{showCreateForm ? 'Tutup Form Baru' : '+ Tambah Paket Baru'}
			</button>
		</div>

		{#if showCreateForm}
			<form method="POST" action="?/savePackage" use:enhance class="mt-4 space-y-3 rounded-2xl border border-blue-200 bg-[#F8FBFF] p-5">
				<h3 class="text-xs font-bold text-blue-800">Tambah Paket Baru</h3>
				<div class="grid gap-3 sm:grid-cols-4">
					<input name="name" required placeholder="Nama Paket *" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs sm:col-span-2" />
					<input name="priceIdr" type="number" required value="350000" placeholder="Harga (Rp)" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					<input name="observationMinutes" type="number" value="45" placeholder="Observasi (mnt)" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
				</div>
				<textarea name="features" rows="3" placeholder="Daftar fasilitas paket (1 baris = 1 poin)" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs"></textarea>
				<div class="flex flex-wrap gap-5 text-xs font-semibold text-slate-700">
					<label class="flex items-center gap-2">
						<input type="checkbox" name="isRecommended" class="accent-blue-600" />
						<span>Tandai Paling Direkomendasikan</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" name="isActive" checked class="accent-blue-600" />
						<span>Tampilkan di Landing Page</span>
					</label>
				</div>
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Paket Baru
				</button>
			</form>
		{/if}

		<div class="mt-4 divide-y divide-blue-50">
			{#each data.packages as pkg (pkg.id)}
				<div class="py-4">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-2">
								<span class="font-heading text-base font-bold text-slate-900">{pkg.name}</span>
								{#if pkg.isRecommended}
									<span class="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
										Direkomendasikan
									</span>
								{/if}
								<span class="rounded-full border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
									{pkg.isActive ? 'Aktif' : 'Nonaktif'}
								</span>
							</div>
							<p class="mt-1 text-sm font-extrabold text-blue-700">Rp {formatRupiah(pkg.priceIdr)}</p>
							<p class="mt-0.5 text-xs text-slate-500">
								Observasi {pkg.observationMinutes} menit • Free Dashboard {pkg.dashboardFreeDays} hari
							</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => (editingId = editingId === pkg.id ? null : pkg.id)}
								class="cursor-pointer rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
							>
								{editingId === pkg.id ? 'Tutup' : 'Edit'}
							</button>
							<form method="POST" action="?/deletePackage" use:enhance>
								<input type="hidden" name="id" value={pkg.id} />
								<button
									type="submit"
									class="cursor-pointer rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-blue-50"
								>
									Hapus
								</button>
							</form>
						</div>
					</div>

					{#if editingId === pkg.id}
						<form method="POST" action="?/savePackage" use:enhance class="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
							<input type="hidden" name="id" value={pkg.id} />
							<input type="hidden" name="slug" value={pkg.slug} />
							<div class="grid gap-3 sm:grid-cols-4">
								<input name="name" required value={pkg.name} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs sm:col-span-2" />
								<input name="priceIdr" type="number" required value={pkg.priceIdr} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								<input name="observationMinutes" type="number" value={pkg.observationMinutes} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
							</div>
							<input name="dashboardFreeDays" type="number" value={pkg.dashboardFreeDays} placeholder="Free Dashboard (hari)" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
							<textarea name="features" rows="4" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs">{pkg.features.join('\n')}</textarea>
							<div class="flex flex-wrap gap-5 text-xs font-semibold text-slate-700">
								<label class="flex items-center gap-2">
									<input type="checkbox" name="isRecommended" checked={pkg.isRecommended} class="accent-blue-600" />
									<span>Tandai Paling Direkomendasikan</span>
								</label>
								<label class="flex items-center gap-2">
									<input type="checkbox" name="isActive" checked={pkg.isActive} class="accent-blue-600" />
									<span>Tampilkan di Landing Page</span>
								</label>
							</div>
							<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
								Simpan Perubahan
							</button>
						</form>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</DashboardShell>
