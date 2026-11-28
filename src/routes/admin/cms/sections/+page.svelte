<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const navItems = getAdminNavItems('/admin/cms/sections');

	let activeTab = $state<'advantages' | 'flow' | 'transparency' | 'facilities' | 'teams' | 'faq'>(
		'advantages'
	);

	let advItems = $state<typeof data.advantages.items>([]);
	let flowSteps = $state<typeof data.flow.steps>([]);
	let facItems = $state<typeof data.facilities.items>([]);
	let teamMembers = $state<typeof data.teams.members>([]);
	let faqItems = $state<typeof data.faq.items>([]);

	$effect(() => {
		advItems = structuredClone(data.advantages.items);
		flowSteps = structuredClone(data.flow.steps);
		facItems = structuredClone(data.facilities.items);
		teamMembers = structuredClone(data.teams.members);
		faqItems = structuredClone(data.faq.items);
	});
</script>

<svelte:head>
	<title>CMS Section Konten — Admin Harapanku</title>
</svelte:head>

<DashboardShell
	title="CMS: Section Konten"
	subtitle="Edit Keunggulan, Alur Terapi, Teknologi Transparansi, Fasilitas Klinik, dan FAQ"
	roleLabel="Admin • Care Coordinator"
	userName={data.user?.fullName ?? 'Admin Klinik'}
	{navItems}
>
	<!-- Section Tabs -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each [
			{ id: 'advantages', label: '4. Keunggulan Harapanku' },
			{ id: 'flow', label: '6. Alur Terapi Kami' },
			{ id: 'transparency', label: '7. Teknologi Transparansi' },
			{ id: 'facilities', label: '8. Fasilitas Klinik' },
			{ id: 'teams', label: 'Our Teams' },
			{ id: 'faq', label: '11. Bantuan & FAQ' }
		] as t}
			<button
				type="button"
				onclick={() => (activeTab = t.id as typeof activeTab)}
				class="cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition {activeTab === t.id
					? 'bg-blue-600 text-white shadow-xs'
					: 'border border-blue-200 bg-white text-blue-700 hover:bg-blue-50'}"
			>
				{t.label}
			</button>
		{/each}
	</div>

	{#if form?.error}
		<div class="mb-4 rounded-xl border border-blue-200 bg-white p-3 text-xs font-semibold text-blue-800">
			{form.error}
		</div>
	{/if}
	{#if form?.successSection}
		<div class="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
			Perubahan section <strong>{form.successSection}</strong> berhasil disimpan!
		</div>
	{/if}

	{#if activeTab === 'advantages'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Keunggulan Harapanku</h2>
			<form method="POST" action="?/saveAdvantages" use:enhance class="mt-4 space-y-4">
				<input type="hidden" name="itemsJson" value={JSON.stringify(advItems)} />
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="adv-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="adv-badge" name="badge" value={data.advantages.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="adv-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
						<input id="adv-title" name="title" value={data.advantages.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="adv-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
					<textarea id="adv-sub" name="subtitle" rows="2" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.advantages.subtitle}</textarea>
				</div>

				<div class="space-y-3">
					{#each advItems as item, i}
						<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-xs font-bold text-blue-700">Kartu Keunggulan #{i + 1}</span>
								{#if advItems.length > 1}
									<button
										type="button"
										onclick={() => (advItems = advItems.filter((_, idx) => idx !== i))}
										class="text-xs font-semibold text-blue-700 hover:underline"
									>
										Hapus
									</button>
								{/if}
							</div>
							<div class="grid gap-3 sm:grid-cols-3">
								<input bind:value={item.icon} placeholder="Icon Material (mis. monitoring)" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
								<input bind:value={item.title} placeholder="Judul Kartu" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs sm:col-span-2" />
							</div>
							<textarea bind:value={item.description} rows="2" class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs"></textarea>
						</div>
					{/each}
				</div>

				<div class="flex flex-wrap gap-3">
					<button
						type="button"
						onclick={() =>
							(advItems = [...advItems, { icon: 'verified', title: 'Keunggulan Baru', description: '' }])}
						class="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
					>
						+ Tambah Kartu
					</button>
					<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white hover:bg-blue-700">
						Simpan Keunggulan
					</button>
				</div>
			</form>
		</section>
	{:else if activeTab === 'flow'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Alur Terapi Kami</h2>
			<form method="POST" action="?/saveFlow" use:enhance class="mt-4 space-y-4">
				<input type="hidden" name="stepsJson" value={JSON.stringify(flowSteps)} />
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="flow-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="flow-badge" name="badge" value={data.flow.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="flow-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
						<input id="flow-title" name="title" value={data.flow.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="flow-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
						<input id="flow-sub" name="subtitle" value={data.flow.subtitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="flow-note" class="mb-1 block text-xs font-bold text-slate-700">Catatan Bawah</label>
						<input id="flow-note" name="footerNote" value={data.flow.footerNote} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>

				<div class="space-y-3">
					{#each flowSteps as st, i}
						<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
							<p class="mb-2 text-xs font-bold text-blue-700">Langkah #{i + 1}</p>
							<div class="grid gap-3 sm:grid-cols-2">
								<input bind:value={st.stepLabel} placeholder="Label Langkah" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
								<input bind:value={st.title} placeholder="Judul Langkah" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
							</div>
							<textarea bind:value={st.description} rows="2" class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs"></textarea>
						</div>
					{/each}
				</div>

				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Alur Terapi
				</button>
			</form>
		</section>
	{:else if activeTab === 'transparency'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Teknologi Transparansi</h2>
			<form method="POST" action="?/saveTransparency" use:enhance class="mt-4 space-y-4">
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="tr-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="tr-badge" name="badge" value={data.transparency.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="tr-cta" class="mb-1 block text-xs font-bold text-slate-700">Teks Tombol</label>
						<input id="tr-cta" name="ctaLabel" value={data.transparency.ctaLabel} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="tr-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
					<input id="tr-title" name="title" value={data.transparency.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
				</div>
				<div>
					<label for="tr-sub" class="mb-1 block text-xs font-bold text-slate-700">Deskripsi</label>
					<textarea id="tr-sub" name="subtitle" rows="3" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.transparency.subtitle}</textarea>
				</div>
				<div>
					<label for="tr-hl" class="mb-1 block text-xs font-bold text-slate-700">Daftar Poin (1 baris = 1 poin)</label>
					<textarea id="tr-hl" name="highlights" rows="4" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.transparency.highlights.join('\n')}</textarea>
				</div>
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Teknologi Transparansi
				</button>
			</form>
		</section>
	{:else if activeTab === 'facilities'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Fasilitas Klinik</h2>
			<form method="POST" action="?/saveFacilities" enctype="multipart/form-data" use:enhance class="mt-4 space-y-4">
				<input type="hidden" name="itemsJson" value={JSON.stringify(facItems)} />
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="fac-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="fac-badge" name="badge" value={data.facilities.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="fac-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
						<input id="fac-title" name="title" value={data.facilities.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="fac-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
					<textarea id="fac-sub" name="subtitle" rows="2" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.facilities.subtitle}</textarea>
				</div>

				<div class="space-y-4">
					{#each facItems as fac, i}
						<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
							<p class="mb-2 text-xs font-bold text-blue-700">Ruang Fasilitas #{i + 1}</p>
							<div class="grid gap-3 sm:grid-cols-3">
								<input bind:value={fac.tag} placeholder="Tag" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
								<input bind:value={fac.title} placeholder="Nama Ruangan" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
								<input bind:value={fac.footerLabel} placeholder="Label Bawah" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
							</div>
							<textarea bind:value={fac.description} rows="2" class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs"></textarea>
							<div class="mt-3 flex flex-wrap items-center gap-4">
								<img src={fac.imageUrl} alt={fac.title} class="h-16 w-24 rounded-lg border border-blue-100 object-cover" />
								<div class="flex-1 space-y-1">
									<input bind:value={fac.imageUrl} placeholder="URL Gambar" class="w-full rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs" />
									<input name="facilityFile_{i}" type="file" accept="image/png,image/jpeg,image/webp" class="text-xs text-slate-600" />
								</div>
							</div>
						</div>
					{/each}
				</div>

				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
					Simpan Fasilitas Klinik
				</button>
			</form>
		</section>
	{:else if activeTab === 'teams'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Our Teams</h2>
			<form method="POST" action="?/saveTeams" enctype="multipart/form-data" use:enhance class="mt-4 space-y-4">
				<input type="hidden" name="membersJson" value={JSON.stringify(teamMembers)} />
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="tm-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="tm-badge" name="badge" value={data.teams.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="tm-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
						<input id="tm-title" name="title" value={data.teams.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="tm-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
					<textarea id="tm-sub" name="subtitle" rows="2" class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm">{data.teams.subtitle}</textarea>
				</div>

				<div class="space-y-4">
					{#each teamMembers as member, i}
						<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-xs font-bold text-blue-700">Anggota Tim #{i + 1}</span>
								{#if teamMembers.length > 1}
									<button
										type="button"
										onclick={() => (teamMembers = teamMembers.filter((_, idx) => idx !== i))}
										class="text-xs font-semibold text-blue-700 hover:underline"
									>
										Hapus
									</button>
								{/if}
							</div>
							<div class="grid gap-3 sm:grid-cols-2">
								<input bind:value={member.name} placeholder="Nama Lengkap & Gelar" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold" />
								<input bind:value={member.role} placeholder="Jabatan" class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs" />
							</div>
							<textarea bind:value={member.summary} rows="2" placeholder="Ringkasan profil / spesialisasi..." class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs"></textarea>
							<div class="mt-3 flex flex-wrap items-center gap-4">
								<img src={member.photoUrl} alt={member.name} class="h-16 w-20 rounded-lg border border-blue-100 object-cover" />
								<div class="flex-1 space-y-1">
									<input bind:value={member.photoUrl} placeholder="URL Foto" class="w-full rounded-lg border border-blue-200 bg-white px-3 py-1 text-xs" />
									<input name="teamFile_{i}" type="file" accept="image/png,image/jpeg,image/webp" class="text-xs text-slate-600" />
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="flex flex-wrap gap-3">
					<button
						type="button"
						onclick={() =>
							(teamMembers = [
								...teamMembers,
								{
									name: 'Nama Terapis / Psikolog',
									role: 'Jabatan Spesialis',
									summary: 'Ringkasan pengalaman dan fokus penanganan anak.',
									photoUrl: '/assets/images/team-1.svg'
								}
							])}
						class="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
					>
						+ Tambah Anggota Tim
					</button>
					<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white hover:bg-blue-700">
						Simpan Our Teams
					</button>
				</div>
			</form>
		</section>
	{:else if activeTab === 'faq'}
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<h2 class="font-heading text-base font-bold text-slate-900">Section Bantuan &amp; Informasi (FAQ)</h2>
			<form method="POST" action="?/saveFaq" use:enhance class="mt-4 space-y-4">
				<input type="hidden" name="itemsJson" value={JSON.stringify(faqItems)} />
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="faq-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
						<input id="faq-badge" name="badge" value={data.faq.badge} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="faq-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
						<input id="faq-title" name="title" value={data.faq.title} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>
				<div>
					<label for="faq-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
					<input id="faq-sub" name="subtitle" value={data.faq.subtitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
				</div>
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="faq-ht" class="mb-1 block text-xs font-bold text-slate-700">Judul Banner Bantuan</label>
						<input id="faq-ht" name="helpTitle" value={data.faq.helpTitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
					<div>
						<label for="faq-hs" class="mb-1 block text-xs font-bold text-slate-700">Subjudul Banner Bantuan</label>
						<input id="faq-hs" name="helpSubtitle" value={data.faq.helpSubtitle} class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm" />
					</div>
				</div>

				<div class="space-y-3">
					{#each faqItems as fq, i}
						<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-xs font-bold text-blue-700">Pertanyaan #{i + 1}</span>
								{#if faqItems.length > 1}
									<button
										type="button"
										onclick={() => (faqItems = faqItems.filter((_, idx) => idx !== i))}
										class="text-xs font-semibold text-blue-700 hover:underline"
									>
										Hapus
									</button>
								{/if}
							</div>
							<input bind:value={fq.q} placeholder="Pertanyaan" class="w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold" />
							<textarea bind:value={fq.a} rows="2" placeholder="Jawaban" class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs"></textarea>
						</div>
					{/each}
				</div>

				<div class="flex flex-wrap gap-3">
					<button
						type="button"
						onclick={() => (faqItems = [...faqItems, { q: 'Pertanyaan baru?', a: '' }])}
						class="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
					>
						+ Tambah Pertanyaan FAQ
					</button>
					<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white hover:bg-blue-700">
						Simpan FAQ &amp; Bantuan
					</button>
				</div>
			</form>
		</section>
	{/if}
</DashboardShell>
