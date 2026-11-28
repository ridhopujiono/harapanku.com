<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const navItems = getAdminNavItems('/admin/cms/services');

	let editingId = $state<number | null>(null);
	let showCreateForm = $state(false);
</script>

<svelte:head>
	<title>CMS Layanan Kami — Admin Harapanku</title>
</svelte:head>

<DashboardShell
	title="CMS: Layanan Kami"
	subtitle="Kelola judul section dan daftar program terapi (Tambah, Edit, Nonaktifkan, Hapus)"
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

	<!-- Header Section -->
	<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<h2 class="font-heading text-base font-bold text-slate-900">Header Section Layanan Kami</h2>
		<form method="POST" action="?/saveHeader" use:enhance class="mt-4 grid gap-3 sm:grid-cols-2">
			<div>
				<label for="svc-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
				<input id="svc-badge" name="badge" value={data.header.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div>
				<label for="svc-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
				<input id="svc-title" name="title" value={data.header.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<label for="svc-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
				<input id="svc-sub" name="subtitle" value={data.header.subtitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Header Layanan
				</button>
			</div>
		</form>
	</section>

	<!-- CRUD Daftar Layanan -->
	<section class="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 pb-4">
			<div>
				<h2 class="font-heading text-base font-bold text-slate-900">Daftar Program Terapi ({data.services.length})</h2>
				<p class="text-xs text-slate-500">Data tersimpan langsung di tabel MySQL services</p>
			</div>
			<button
				type="button"
				onclick={() => (showCreateForm = !showCreateForm)}
				class="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
			>
				{showCreateForm ? 'Tutup Form Baru' : '+ Tambah Layanan Baru'}
			</button>
		</div>

		{#if showCreateForm}
			<form method="POST" action="?/saveService" use:enhance class="mt-4 space-y-3 rounded-2xl border border-blue-200 bg-[#F8FBFF] p-5">
				<h3 class="text-xs font-bold text-blue-800">Tambah Layanan Terapi Baru</h3>
				<div class="grid gap-3 sm:grid-cols-3">
					<input name="name" required placeholder="Nama Layanan *" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					<input name="categoryLabel" required placeholder="Label Kategori *" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					<input name="durationMinutes" type="number" min="15" value="60" placeholder="Durasi (menit)" class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
				</div>
				<textarea name="description" required rows="2" placeholder="Deskripsi layanan..." class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs"></textarea>
				<textarea name="highlights" rows="3" placeholder="Poin keunggulan (1 baris = 1 poin)" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs"></textarea>
				<label class="flex items-center gap-2 text-xs font-semibold text-slate-700">
					<input type="checkbox" name="isActive" checked class="accent-blue-600" />
					<span>Tampilkan di Landing Page</span>
				</label>
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Layanan Baru
				</button>
			</form>
		{/if}

		<div class="mt-4 divide-y divide-blue-50">
			{#each data.services as svc (svc.id)}
				<div class="py-4">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div>
							<div class="flex items-center gap-2">
								<span class="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
									{svc.categoryLabel}
								</span>
								<span class="text-xs text-slate-500">{svc.durationMinutes} Menit</span>
								<span class="rounded-full px-2 py-0.5 text-[10px] font-bold {svc.isActive ? 'bg-blue-600 text-white' : 'border border-blue-200 text-slate-500'}">
									{svc.isActive ? 'Aktif' : 'Nonaktif'}
								</span>
							</div>
							<h3 class="mt-1.5 font-heading text-base font-bold text-slate-900">{svc.name}</h3>
							<p class="mt-1 text-xs text-slate-600">{svc.description}</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								onclick={() => (editingId = editingId === svc.id ? null : svc.id)}
								class="cursor-pointer rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
							>
								{editingId === svc.id ? 'Tutup' : 'Edit'}
							</button>
							<form method="POST" action="?/deleteService" use:enhance>
								<input type="hidden" name="id" value={svc.id} />
								<button
									type="submit"
									class="cursor-pointer rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-blue-50"
								>
									Hapus
								</button>
							</form>
						</div>
					</div>

					{#if editingId === svc.id}
						<form method="POST" action="?/saveService" use:enhance class="mt-4 space-y-3 rounded-2xl border border-blue-100 bg-[#F8FBFF] p-4">
							<input type="hidden" name="id" value={svc.id} />
							<input type="hidden" name="slug" value={svc.slug} />
							<div class="grid gap-3 sm:grid-cols-3">
								<input name="name" required value={svc.name} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								<input name="categoryLabel" required value={svc.categoryLabel} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								<input name="durationMinutes" type="number" value={svc.durationMinutes} class="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
							</div>
							<textarea name="description" required rows="2" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs">{svc.description}</textarea>
							<textarea name="highlights" rows="3" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs">{svc.highlights.join('\n')}</textarea>
							<label class="flex items-center gap-2 text-xs font-semibold text-slate-700">
								<input type="checkbox" name="isActive" checked={svc.isActive} class="accent-blue-600" />
								<span>Tampilkan di Landing Page</span>
							</label>
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
