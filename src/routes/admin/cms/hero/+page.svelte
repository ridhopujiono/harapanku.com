<script lang="ts">
	import { enhance } from '$app/forms';
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import { getAdminNavItems } from '$lib/components/admin-nav';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const navItems = getAdminNavItems('/admin/cms/hero');

	let trustBadgesText = $derived(data.hero.trustBadges.join('\n'));
</script>

<svelte:head>
	<title>CMS Hero &amp; Footer — Admin Harapanku</title>
</svelte:head>

<DashboardShell
	title="CMS: Hero &amp; Footer"
	subtitle="Kelola Judul Hero, Subjudul Hero, Gambar Hero, dan informasi Footer Landing Page"
	roleLabel="Admin • Care Coordinator"
	userName={data.user?.fullName ?? 'Admin Klinik'}
	{navItems}
>
	{#if form?.error}
		<div class="mb-5 rounded-xl border border-blue-200 bg-white p-3.5 text-xs font-semibold text-blue-800">
			{form.error}
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Hero Editor -->
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<div class="border-b border-blue-50 pb-4">
				<h2 class="font-heading text-base font-bold text-slate-900">1–3. Pengaturan Hero Section</h2>
				<p class="text-xs text-slate-500">Judul utama, subjudul, gambar hero, dan badge kepercayaan</p>
			</div>

			{#if form?.successHero}
				<div class="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
					Perubahan Hero Section berhasil disimpan ke database!
				</div>
			{/if}

			<form
				method="POST"
				action="?/saveHero"
				enctype="multipart/form-data"
				use:enhance
				class="mt-5 space-y-4"
			>
				<div>
					<label for="hero-badge" class="mb-1 block text-xs font-bold text-slate-700">Badge Atas</label>
					<input
						id="hero-badge"
						name="badge"
						value={data.hero.badge}
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					/>
				</div>

				<div>
					<label for="hero-title" class="mb-1 block text-xs font-bold text-slate-700">Judul Hero *</label>
					<input
						id="hero-title"
						name="title"
						required
						value={data.hero.title}
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					/>
				</div>

				<div>
					<label for="hero-subtitle" class="mb-1 block text-xs font-bold text-slate-700">Subjudul Hero *</label>
					<textarea
						id="hero-subtitle"
						name="subtitle"
						rows="3"
						required
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					>{data.hero.subtitle}</textarea>
				</div>

				<div class="rounded-xl border border-blue-100 bg-[#F8FBFF] p-4">
					<p class="text-xs font-bold text-slate-800">Gambar Hero Saat Ini</p>
					<img
						src={data.hero.imageUrl}
						alt="Preview Hero"
						class="mt-2 h-32 w-48 rounded-xl border border-blue-100 object-cover"
					/>
					<div class="mt-3 space-y-2">
						<label for="hero-image-url" class="block text-xs font-semibold text-slate-600">
							URL Gambar Hero
						</label>
						<input
							id="hero-image-url"
							name="imageUrl"
							value={data.hero.imageUrl}
							class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
						/>
						<label for="hero-image-file" class="block text-xs font-semibold text-slate-600">
							Atau Upload Gambar Baru (PNG/JPG/WEBP, maks 5MB)
						</label>
						<input
							id="hero-image-file"
							name="imageFile"
							type="file"
							accept="image/png,image/jpeg,image/webp"
							class="w-full text-xs text-slate-600"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="hero-cta1" class="mb-1 block text-xs font-bold text-slate-700">Tombol Utama</label>
						<input
							id="hero-cta1"
							name="ctaPrimary"
							value={data.hero.ctaPrimary}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
					<div>
						<label for="hero-cta2" class="mb-1 block text-xs font-bold text-slate-700">Tombol WhatsApp</label>
						<input
							id="hero-cta2"
							name="ctaSecondary"
							value={data.hero.ctaSecondary}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div>
						<label for="hero-rating" class="mb-1 block text-xs font-bold text-slate-700">Rating</label>
						<input
							id="hero-rating"
							name="ratingScore"
							value={data.hero.ratingScore}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
					<div>
						<label for="hero-rating-lbl" class="mb-1 block text-xs font-bold text-slate-700">Label Rating</label>
						<input
							id="hero-rating-lbl"
							name="ratingLabel"
							value={data.hero.ratingLabel}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
					<div>
						<label for="hero-slot" class="mb-1 block text-xs font-bold text-slate-700">Badge Slot</label>
						<input
							id="hero-slot"
							name="slotBadge"
							value={data.hero.slotBadge}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
				</div>

				<div>
					<label for="hero-trust" class="mb-1 block text-xs font-bold text-slate-700">
						3 Poin Kepercayaan (1 baris = 1 poin)
					</label>
					<textarea
						id="hero-trust"
						name="trustBadges"
						rows="3"
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					>{trustBadgesText}</textarea>
				</div>

				<button
					type="submit"
					class="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
				>
					Simpan Hero Section
				</button>
			</form>
		</section>

		<!-- Footer Editor -->
		<section class="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
			<div class="border-b border-blue-50 pb-4">
				<h2 class="font-heading text-base font-bold text-slate-900">12. Pengaturan Footer</h2>
				<p class="text-xs text-slate-500">Alamat klinik, kontak telepon/WhatsApp, dan jam layanan</p>
			</div>

			{#if form?.successFooter}
				<div class="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
					Perubahan Footer berhasil disimpan ke database!
				</div>
			{/if}

			<form method="POST" action="?/saveFooter" use:enhance class="mt-5 space-y-4">
				<div>
					<label for="footer-desc" class="mb-1 block text-xs font-bold text-slate-700">Deskripsi Klinik</label>
					<textarea
						id="footer-desc"
						name="description"
						rows="3"
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					>{data.footer.description}</textarea>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="footer-wa" class="mb-1 block text-xs font-bold text-slate-700">Nomor WhatsApp Tampil</label>
						<input
							id="footer-wa"
							name="whatsappDisplay"
							value={data.footer.whatsappDisplay}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
					<div>
						<label for="footer-phone" class="mb-1 block text-xs font-bold text-slate-700">Nomor Telepon</label>
						<input
							id="footer-phone"
							name="phone"
							value={data.footer.phone}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
				</div>

				<div>
					<label for="footer-addr" class="mb-1 block text-xs font-bold text-slate-700">Alamat Klinik</label>
					<textarea
						id="footer-addr"
						name="address"
						rows="2"
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					>{data.footer.address}</textarea>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="footer-hw" class="mb-1 block text-xs font-bold text-slate-700">Jam Senin–Sabtu</label>
						<input
							id="footer-hw"
							name="hoursWeekday"
							value={data.footer.hoursWeekday}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
					<div>
						<label for="footer-hs" class="mb-1 block text-xs font-bold text-slate-700">Jam Minggu</label>
						<input
							id="footer-hs"
							name="hoursSunday"
							value={data.footer.hoursSunday}
							class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
						/>
					</div>
				</div>

				<div>
					<label for="footer-copy" class="mb-1 block text-xs font-bold text-slate-700">Teks Copyright</label>
					<input
						id="footer-copy"
						name="copyright"
						value={data.footer.copyright}
						class="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
					/>
				</div>

				<button
					type="submit"
					class="w-full cursor-pointer rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
				>
					Simpan Footer
				</button>
			</form>
		</section>
	</div>
</DashboardShell>
