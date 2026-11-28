<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const navItems = getAdminNavItems('/admin/cms/articles');

	let editingId = $state<number | null>(null);
	let showCreateForm = $state(false);

	function toDatetimeLocal(iso: string) {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '';
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	function formatShortDate(iso: string) {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return iso;
		return new Intl.DateTimeFormat('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		}).format(d);
	}
</script>

<svelte:head>
	<title>CMS Articles — Admin Harapanku</title>
</svelte:head>

<DashboardShell
	title="CMS: Articles &amp; Edukasi"
	subtitle="Kelola header section dan artikel edukasi (Tambah, Edit, Publish/Draft, Hapus)"
	roleLabel="Admin • Care Coordinator"
	userName={data.user?.fullName ?? 'Admin Klinik'}
	{navItems}
>
	{#if form?.error}
		<div class="mb-4 rounded-xl border border-blue-300 bg-white p-3 text-xs font-bold text-blue-900">
			{form.error}
		</div>
	{/if}
	{#if form?.successMsg}
		<div class="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
			{form.successMsg}
		</div>
	{/if}

	<!-- Header Section Articles -->
	<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<h2 class="font-heading text-base font-bold text-slate-900">Header Section Articles</h2>
		<p class="mt-0.5 text-xs text-slate-500">Ditampilkan tepat di bawah Hero section pada halaman utama</p>
		<form method="POST" action="?/saveHeader" use:enhance class="mt-4 grid gap-3 sm:grid-cols-2">
			<div>
				<label for="art-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge</label>
				<input id="art-badge" name="badge" value={data.header.badge} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm" />
			</div>
			<div>
				<label for="art-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Section</label>
				<input id="art-title" name="title" value={data.header.title} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<label for="art-sub" class="mb-1 block text-xs font-bold text-slate-700">Subjudul</label>
				<input id="art-sub" name="subtitle" value={data.header.subtitle} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm" />
			</div>
			<div class="sm:col-span-2">
				<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
					Simpan Header Articles
				</button>
			</div>
		</form>
	</section>

	<!-- CRUD Daftar Artikel -->
	<section class="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-blue-50 pb-4">
			<div>
				<h2 class="font-heading text-base font-bold text-slate-900">Daftar Artikel ({data.articles.length})</h2>
				<p class="text-xs text-slate-500">Diurutkan dari tanggal publikasi terbaru di awal</p>
			</div>
			<button
				type="button"
				onclick={() => (showCreateForm = !showCreateForm)}
				class="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
			>
				{showCreateForm ? 'Tutup Form Artikel Baru' : '+ Tambah Artikel Baru'}
			</button>
		</div>

		{#if showCreateForm}
			<form
				method="POST"
				action="?/saveArticle"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							showCreateForm = false;
						}
					};
				}}
				class="mt-5 space-y-4 rounded-2xl border border-blue-200 bg-[#F8FBFF] p-5"
			>
				<h3 class="text-sm font-bold text-blue-900">Tulis Artikel Baru</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="new-art-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Artikel *</label>
						<input id="new-art-title" name="title" required placeholder="Judul artikel..." class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div>
						<label for="new-art-slug" class="mb-1 block text-xs font-bold text-slate-700">Slug URL (opsional, otomatis dari judul)</label>
						<input id="new-art-slug" name="slug" placeholder="contoh: deteksi-dini-speech-delay" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div>
						<label for="new-art-author" class="mb-1 block text-xs font-bold text-slate-700">Penulis *</label>
						<input id="new-art-author" name="authorName" required placeholder="dr. Nadia Kusuma, Sp.KFR" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div>
						<label for="new-art-tags" class="mb-1 block text-xs font-bold text-slate-700">Tag (pisahkan dengan koma)</label>
						<input id="new-art-tags" name="tags" placeholder="Terapi Wicara, Deteksi Dini, Parenting" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div>
						<label for="new-art-image-url" class="mb-1 block text-xs font-bold text-slate-700">URL Gambar (atau unggah file)</label>
						<input id="new-art-image-url" name="imageUrl" value="/assets/images/article-1.svg" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div>
						<label for="new-art-image-file" class="mb-1 block text-xs font-bold text-slate-700">Upload Gambar Cover (JPG/PNG/WebP)</label>
						<input id="new-art-image-file" name="imageFile" type="file" accept="image/*" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs" />
					</div>
					<div>
						<label for="new-art-pub" class="mb-1 block text-xs font-bold text-slate-700">Tanggal Publikasi</label>
						<input id="new-art-pub" name="publishedAt" type="datetime-local" value={toDatetimeLocal(new Date().toISOString())} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
					</div>
					<div class="flex items-end pb-1">
						<label class="flex items-center gap-2 text-xs font-semibold text-slate-700">
							<input type="checkbox" name="isPublished" checked class="accent-blue-600" />
							<span>Publikasikan di Landing Page</span>
						</label>
					</div>
				</div>
				<div>
					<label for="new-art-abstract" class="mb-1 block text-xs font-bold text-slate-700">Abstrak / Ringkasan *</label>
					<textarea id="new-art-abstract" name="abstract" required rows="2" placeholder="Ringkasan singkat artikel..." class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs"></textarea>
				</div>
				<div>
					<label for="new-art-content" class="mb-1 block text-xs font-bold text-slate-700">Isi Artikel Lengkap *</label>
					<textarea id="new-art-content" name="content" required rows="6" placeholder="Tulis isi artikel lengkap (pisahkan paragraf dengan baris kosong)..." class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs"></textarea>
				</div>
				<div class="flex gap-2">
					<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
						Simpan &amp; Terbitkan Artikel
					</button>
					<button type="button" onclick={() => (showCreateForm = false)} class="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50">
						Batal
					</button>
				</div>
			</form>
		{/if}

		<!-- Daftar Artikel -->
		<div class="mt-5 space-y-4">
			{#each data.articles as art (art.id)}
				<div class="rounded-2xl border border-blue-100 bg-white p-4 transition hover:border-blue-200">
					<div class="flex flex-col justify-between gap-4 md:flex-row md:items-start">
						<div class="flex flex-col gap-4 sm:flex-row">
							<img
								src={art.imageUrl}
								alt={art.title}
								class="h-24 w-full shrink-0 rounded-xl border border-blue-100 bg-[#F4F8FF] object-cover sm:w-36"
							/>
							<div class="min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold {art.isPublished ? 'bg-blue-50 text-blue-700' : 'border border-blue-200 bg-white text-slate-500'}">
										{art.isPublished ? 'Published' : 'Draft'}
									</span>
									<span class="text-[11px] font-semibold text-slate-500">
										{formatShortDate(art.publishedAt)}
									</span>
									<span class="text-[11px] font-semibold text-blue-700">
										• {art.viewCount.toLocaleString('id-ID')} pembaca
									</span>
								</div>
								<h3 class="mt-1.5 font-heading text-sm font-bold text-slate-900 sm:text-base">
									{art.title}
								</h3>
								<p class="mt-1 line-clamp-2 text-xs text-slate-600">{art.abstract}</p>
								<div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
									<span class="font-semibold text-slate-700">Penulis: {art.authorName}</span>
									{#each art.tags as tag}
										<span class="rounded-full bg-[#F4F8FF] px-2.5 py-0.5 font-semibold text-blue-700">
											#{tag}
										</span>
									{/each}
								</div>
							</div>
						</div>

						<div class="flex shrink-0 flex-wrap items-center gap-2">
							<a
								href={`/articles/${art.slug}`}
								target="_blank"
								rel="noopener"
								class="rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
							>
								Lihat
							</a>
							<button
								type="button"
								onclick={() => (editingId = editingId === art.id ? null : art.id)}
								class="cursor-pointer rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
							>
								{editingId === art.id ? 'Tutup' : 'Edit'}
							</button>
							<form method="POST" action="?/deleteArticle" use:enhance>
								<input type="hidden" name="id" value={art.id} />
								<button
									type="submit"
									class="cursor-pointer rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-900"
								>
									Hapus
								</button>
							</form>
						</div>
					</div>

					{#if editingId === art.id}
						<form
							method="POST"
							action="?/saveArticle"
							enctype="multipart/form-data"
							use:enhance={() => {
								return async ({ result, update }) => {
									await update();
									if (result.type === 'success') {
										editingId = null;
									}
								};
							}}
							class="mt-4 space-y-3 border-t border-blue-100 bg-[#F8FBFF] p-4 rounded-xl"
						>
							<input type="hidden" name="id" value={art.id} />
							<div class="grid gap-3 sm:grid-cols-2">
								<div>
									<label for={`edit-title-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Judul Artikel *</label>
									<input id={`edit-title-${art.id}`} name="title" value={art.title} required class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div>
									<label for={`edit-slug-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Slug URL *</label>
									<input id={`edit-slug-${art.id}`} name="slug" value={art.slug} required class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div>
									<label for={`edit-author-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Penulis *</label>
									<input id={`edit-author-${art.id}`} name="authorName" value={art.authorName} required class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div>
									<label for={`edit-tags-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Tag (pisahkan dengan koma)</label>
									<input id={`edit-tags-${art.id}`} name="tags" value={art.tags.join(', ')} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div>
									<label for={`edit-img-url-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">URL Gambar Cover</label>
									<input id={`edit-img-url-${art.id}`} name="imageUrl" value={art.imageUrl} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div>
									<label for={`edit-img-file-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Ganti Gambar via Upload</label>
									<input id={`edit-img-file-${art.id}`} name="imageFile" type="file" accept="image/*" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs" />
								</div>
								<div>
									<label for={`edit-pub-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Tanggal Publikasi</label>
									<input id={`edit-pub-${art.id}`} name="publishedAt" type="datetime-local" value={toDatetimeLocal(art.publishedAt)} class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs" />
								</div>
								<div class="flex items-end pb-1">
									<label class="flex items-center gap-2 text-xs font-semibold text-slate-700">
										<input type="checkbox" name="isPublished" checked={art.isPublished} class="accent-blue-600" />
										<span>Publikasikan di Landing Page</span>
									</label>
								</div>
							</div>
							<div>
								<label for={`edit-abs-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Abstrak *</label>
								<textarea id={`edit-abs-${art.id}`} name="abstract" required rows="2" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs">{art.abstract}</textarea>
							</div>
							<div>
								<label for={`edit-cnt-${art.id}`} class="mb-1 block text-xs font-bold text-slate-700">Isi Artikel *</label>
								<textarea id={`edit-cnt-${art.id}`} name="content" required rows="6" class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs">{art.content}</textarea>
							</div>
							<div class="flex gap-2">
								<button type="submit" class="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
									Simpan Perubahan
								</button>
								<button type="button" onclick={() => (editingId = null)} class="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50">
									Batal
								</button>
							</div>
						</form>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</DashboardShell>
