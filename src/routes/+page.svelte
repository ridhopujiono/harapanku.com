<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let mobileMenuOpen = $state(false);
	let isModalOpen = $state(false);
	let selectedComplaint = $state('');
	let selectedPackageLabel = $state('');
	let selectedServiceId = $state<number | null>(null);
	let selectedPackageId = $state<number | null>(null);
	let isSubmitting = $state(false);

	// Demo Parent Dashboard state
	let activeTab = $state<'radar' | 'session' | 'goals'>('radar');
	let demoTargets = $state([
		{
			id: 1,
			title: 'Merespons panggilan nama dalam tempo < 3 detik',
			note: 'Tercapai konsisten pada sesi #11',
			done: true
		},
		{
			id: 2,
			title: 'Mengucapkan kombinasi 2 kata bermakna ("mau makan", "buka pintu")',
			note: 'Tercapai konsisten pada sesi #13',
			done: true
		},
		{
			id: 3,
			title: 'Mempertahankan fokus duduk 10 menit berturut-turut tanpa distraksi',
			note: 'Sedang dalam proses stimulasi intensif (Target pekan ke-3)',
			done: false
		},
		{
			id: 4,
			title: 'Kemandirian memasang sepatu sendiri dengan perekat velcro',
			note: 'Koordinasi motorik halus (ADL)',
			done: false
		}
	]);

	let achievedCount = $derived(demoTargets.filter((t) => t.done).length);
	let achievedPct = $derived(Math.round((achievedCount / demoTargets.length) * 100));

	// FAQ state
	let openFaq = $state<number | null>(0);
	const faqs = [
		{
			q: 'Apakah ada masa tunggu (waiting list) untuk memulai asesmen atau terapi?',
			a: 'Di Harapanku, kami berkomitmen Zero Waiting List untuk asesmen awal. Jadwal asesmen dapat dikonfirmasi dalam 1–3 hari kerja sejak pendaftaran online, sehingga intervensi penting bagi buah hati tidak tertunda berbulan-bulan seperti di faskes konvensional.'
		},
		{
			q: 'Bagaimana latar belakang dan sertifikasi para terapis di Harapanku?',
			a: 'Seluruh tenaga terapis kami (Terapis Wicara, Terapis Okupasi, dan Terapi Perilaku/ABA) memiliki Surat Tanda Registrasi (STR) aktif dari Kementerian Kesehatan RI dan merupakan lulusan sarjana profesi dari universitas terkemuka. Seluruh program disupervisi langsung oleh Psikolog Klinis Anak anggota HIMPSI.'
		},
		{
			q: 'Berapa usia anak yang dapat mengikuti terapi di Klinik Harapanku?',
			a: 'Kami melayani anak usia intervensi dini mulai dari 12 bulan (1 tahun) hingga 12 tahun. Pendekatan terapi kami berbasis stimulasi bermain interaktif (play-based therapy) yang disesuaikan secara proporsional menurut fase tumbuh kembang dan karakteristik anak.'
		},
		{
			q: 'Apakah orang tua diperbolehkan mendampingi anak selama sesi observasi/terapi?',
			a: 'Tentu saja! Kami sangat menganut filosofi kolaborasi keluarga (family-centered care). Orang tua dapat mendampingi langsung pada sesi asesmen pengantar atau mengamati melalui cermin satu arah (one-way observation window) dan rekaman ringkasan di Parent Dashboard, agar anak dapat berlatih kemandirian tanpa distraksi.'
		}
	];

	function openBookingModal(opts?: {
		complaint?: string;
		packageLabel?: string;
		serviceId?: number | null;
		packageId?: number | null;
	}) {
		selectedComplaint = opts?.complaint ?? '';
		selectedPackageLabel = opts?.packageLabel ?? '';
		selectedServiceId = opts?.serviceId ?? null;
		selectedPackageId = opts?.packageId ?? null;
		mobileMenuOpen = false;
		isModalOpen = true;
	}

	function mapServiceComplaint(slug: string, fallback: string) {
		if (slug === 'asesmen-awal') return 'Belum Tahu Pasti / Butuh Observasi Umum';
		if (slug === 'terapi-aba') return 'Tantrum & Fokus Perilaku (ABA)';
		if (slug === 'terapi-wicara') return 'Speech Delay / Terlambat Bicara';
		if (slug === 'terapi-okupasi') return 'Koordinasi Sensori & Motorik (Okupasi)';
		return fallback;
	}

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID').format(amount);
	}
</script>

<svelte:head>
	<title>Harapanku — Klinik Tumbuh Kembang Anak &amp; Terapi Terpadu Balikpapan</title>
	<meta
		name="description"
		content="Klinik tumbuh kembang anak modern dan terpercaya di Balikpapan. Tanpa antrean berbulan-bulan. Layanan terpadu Terapi ABA, Terapi Wicara, dan Okupasi dengan pemantauan Parent Dashboard transparan."
	/>
</svelte:head>

<!-- ========================================================================= -->
<!-- 1. HEADER / NAVBAR                                                        -->
<!-- ========================================================================= -->
<header
	id="main-navbar"
	class="fixed top-0 left-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md transition-all duration-300"
>
	<div class="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
		<a href="/" class="group flex items-center gap-3" title="Harapanku Clinic">
			<img
				src="/assets/images/logo.png"
				alt="Klinik Tumbuh Kembang Harapanku"
				class="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02] sm:h-11"
			/>
		</a>

		<nav class="hidden items-center gap-7 font-subheading text-sm font-semibold text-slate-600 lg:flex">
			<a href="#layanan" class="py-2 transition-colors hover:text-brand-blue">Layanan Terapi</a>
			<a href="#alur" class="py-2 transition-colors hover:text-brand-blue">Alur Konsultasi</a>
			<a href="#dashboard" class="py-2 transition-colors hover:text-brand-blue">Parent Dashboard</a>
			<a href="#fasilitas" class="py-2 transition-colors hover:text-brand-blue">Fasilitas</a>
			<a href="#paket-asesmen" class="py-2 transition-colors hover:text-brand-blue">Paket Asesmen</a>
			<a href="#faq" class="py-2 transition-colors hover:text-brand-blue">FAQ</a>
			<a
				href="/skrining"
				class="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-bold text-teal-700 shadow-xs transition-all hover:bg-teal-100"
				title="Skrining Mandiri TumbuhKembang.id"
			>
				<span>🌱</span>
				<span>Skrining Mandiri</span>
			</a>
		</nav>

		<div class="flex items-center gap-3">
			<a
				href="https://wa.me/628115400992"
				target="_blank"
				rel="noopener"
				class="hidden h-10 w-10 items-center justify-center rounded-full bg-brand-sage-light text-brand-sage shadow-sm transition-all hover:bg-brand-sage hover:text-white sm:inline-flex"
				title="Chat WhatsApp Resmi"
			>
				<span class="material-symbols-outlined text-[20px]">chat</span>
			</a>

			<button
				type="button"
				onclick={() => openBookingModal()}
				class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-orange px-4 py-2.5 font-subheading text-xs font-bold text-white shadow-[0_4px_14px_rgba(245,166,35,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_6px_18px_rgba(245,166,35,0.45)] active:translate-y-0 sm:px-5 sm:text-sm"
			>
				<span class="material-symbols-outlined text-[18px]">calendar_month</span>
				<span>Daftar Asesmen Awal</span>
			</button>

			<button
				type="button"
				onclick={() => (mobileMenuOpen = true)}
				class="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
				aria-label="Buka Menu"
			>
				<span class="material-symbols-outlined text-[24px]">menu</span>
			</button>
		</div>
	</div>
</header>

<!-- Mobile Drawer Menu -->
{#if mobileMenuOpen}
	<div class="fixed inset-0 z-50">
		<button
			type="button"
			aria-label="Tutup Menu"
			onclick={() => (mobileMenuOpen = false)}
			class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
		></button>
		<div class="fixed top-0 right-0 flex h-full w-4/5 max-w-sm flex-col justify-between overflow-y-auto bg-white p-6 shadow-2xl">
			<div>
				<div class="flex items-center justify-between border-b border-slate-100 pb-4">
					<img src="/assets/images/logo.png" alt="Harapanku Logo" class="h-9 w-auto" />
					<button
						type="button"
						onclick={() => (mobileMenuOpen = false)}
						class="p-2 text-slate-400 hover:text-slate-700"
					>
						<span class="material-symbols-outlined text-[22px]">close</span>
					</button>
				</div>
				<nav class="mt-6 flex flex-col gap-4 font-subheading font-semibold text-slate-700">
					<a href="#layanan" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Layanan Terapi</a>
					<a href="#alur" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Alur Konsultasi</a>
					<a href="#dashboard" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Parent Dashboard</a>
					<a href="#fasilitas" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Fasilitas Klinik</a>
					<a href="#paket-asesmen" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Paket Asesmen &amp; Biaya</a>
					<a href="#faq" onclick={() => (mobileMenuOpen = false)} class="py-1 hover:text-brand-blue">Tanya Jawab (FAQ)</a>
					<a
						href="/skrining"
						class="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-xs font-bold text-teal-700"
					>
						<span>🌱</span>
						<span>Skrining Mandiri (TumbuhKembang.id)</span>
					</a>
					<a href="/login" class="py-1 text-brand-blue">Masuk Portal Orang Tua / Klinik</a>
				</nav>
			</div>
			<div class="flex flex-col gap-3 border-t border-slate-100 pt-6">
				<button
					type="button"
					onclick={() => openBookingModal()}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 font-subheading text-sm font-bold text-white shadow-md"
				>
					<span class="material-symbols-outlined text-[18px]">calendar_month</span>
					<span>Daftar Asesmen Awal</span>
				</button>
				<a
					href="https://wa.me/628115400992"
					target="_blank"
					rel="noopener"
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-sage-light py-3 font-subheading text-sm font-bold text-brand-sage-dark"
				>
					<span class="material-symbols-outlined text-[18px] text-brand-sage">chat</span>
					<span>Chat WhatsApp (+62 811-5400-992)</span>
				</a>
			</div>
		</div>
	</div>
{/if}

<main class="w-full pt-20">
	<!-- ========================================================================= -->
	<!-- 2. HERO SECTION                                                           -->
	<!-- ========================================================================= -->
	<section class="relative w-full overflow-hidden bg-gradient-to-b from-[#f2f7fc] via-white to-[#f8fafc] py-12 md:py-20 lg:py-24">
		<div class="pointer-events-none absolute top-10 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"></div>
		<div class="pointer-events-none absolute right-10 bottom-10 -z-10 h-96 w-96 rounded-full bg-brand-sage-light/70 blur-3xl"></div>

		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
				<!-- Left Column -->
				<div class="flex flex-col items-start text-left lg:col-span-7">
					<div class="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-sage/20 bg-brand-sage-light px-4 py-1.5 font-subheading text-xs font-bold text-brand-sage-dark shadow-xs sm:text-sm">
						<span class="material-symbols-outlined icon-fill text-[18px] text-brand-sage">verified</span>
						<span>Terakreditasi &amp; Lingkungan Ramah Anak di Balikpapan</span>
					</div>

					<h1 class="mb-5 font-heading text-3xl leading-[1.2] font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[46px]">
						Ketahui Kebutuhan Tumbuh Kembang Anak Anda Hari Ini.
					</h1>

					<p class="mb-8 max-w-2xl font-body text-base leading-relaxed text-slate-600 sm:text-lg">
						Tanpa antrean berbulan-bulan. Layanan terpadu
						<span class="font-semibold text-slate-800">Terapi ABA, Wicara, dan Okupasi</span>
						dengan pemantauan data transparan terintegrasi langsung untuk ketenangan pikiran orang tua.
					</p>

					<div class="mb-9 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
						<button
							type="button"
							onclick={() => openBookingModal()}
							class="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-brand-orange px-8 py-4 font-subheading text-base font-extrabold text-white shadow-[0_8px_24px_rgba(245,166,35,0.38)] transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_12px_28px_rgba(245,166,35,0.48)] active:translate-y-0"
						>
							<span class="material-symbols-outlined text-[22px]">calendar_today</span>
							<span>Jadwalkan Asesmen Awal Sekarang</span>
						</button>
						<a
							href="https://wa.me/628115400992?text=Halo%20Klinik%20Harapanku%2C%20saya%20ingin%20tanya%20mengenai%20layanan%20terapi%20tumbuh%20kembang%20anak"
							target="_blank"
							rel="noopener"
							class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-subheading text-base font-bold text-brand-blue shadow-xs transition-all hover:border-brand-blue/30 hover:bg-slate-50"
						>
							<span class="material-symbols-outlined text-[22px] text-brand-sage">chat</span>
							<span>Tanya via WhatsApp</span>
						</a>
					</div>

					<div class="grid w-full grid-cols-1 gap-3.5 border-t border-slate-200/80 pt-4 font-subheading text-xs font-semibold text-slate-600 sm:grid-cols-3 sm:text-sm">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Terapis Ber-STR Kemenkes</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Parent Dashboard Real-Time</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Pendekatan Penuh Kasih</span>
						</div>
					</div>
				</div>

				<!-- Right Column: Hero Photo & Floating Badges -->
				<div class="relative flex items-center justify-center lg:col-span-5">
					<div class="pointer-events-none absolute -inset-6 -z-10 flex items-center justify-center sm:-inset-10">
						<div class="blob-animate h-80 w-80 rounded-[45%_55%_65%_35%/50%_45%_55%_50%] bg-gradient-to-tr from-brand-blue-light via-blue-100 to-sky-50 opacity-90 blur-sm sm:h-[420px] sm:w-[420px]"></div>
						<div class="absolute -bottom-6 -left-6 h-48 w-48 rounded-full bg-gradient-to-br from-brand-sage-light to-[#d8edd9] opacity-80 blur-[2px] sm:h-56 sm:w-56"></div>
					</div>

					<div class="relative mx-auto w-full max-w-md">
						<div class="relative overflow-hidden rounded-[2.25rem] bg-white p-2.5 shadow-[0_16px_40px_rgba(37,99,235,0.08)] ring-1 ring-slate-100">
							<img
								src="/assets/images/hero-clinic-care.png"
								alt="Terapis ramah Harapanku mendampingi stimulasi tumbuh kembang anak"
								class="aspect-[4/3] h-auto w-full rounded-[1.85rem] object-cover"
							/>
						</div>

						<!-- Floating Review Badge -->
						<div class="absolute -bottom-5 -left-4 flex max-w-[270px] items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.09)] backdrop-blur-md sm:left-2">
							<div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-brand-orange">
								<span class="material-symbols-outlined icon-fill text-[24px]">kid_star</span>
							</div>
							<div class="flex flex-col">
								<div class="flex items-center gap-1.5">
									<span class="font-heading text-base leading-none font-bold text-slate-800">4.9 / 5.0</span>
									<div class="flex text-brand-orange">
										<span class="material-symbols-outlined icon-fill text-[13px]">star</span>
										<span class="material-symbols-outlined icon-fill text-[13px]">star</span>
										<span class="material-symbols-outlined icon-fill text-[13px]">star</span>
										<span class="material-symbols-outlined icon-fill text-[13px]">star</span>
										<span class="material-symbols-outlined icon-fill text-[13px]">star</span>
									</div>
								</div>
								<span class="mt-0.5 font-subheading text-xs font-semibold text-slate-500">Kepuasan 350+ Orang Tua</span>
							</div>
						</div>

						<!-- Available Schedule Tag -->
						<div class="absolute -top-3 -right-3 hidden items-center gap-2 rounded-full border border-slate-100 bg-white/95 px-3.5 py-1.5 shadow-md backdrop-blur-md sm:flex">
							<span class="relative flex h-2.5 w-2.5">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-sage opacity-75"></span>
								<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-sage"></span>
							</span>
							<span class="font-subheading text-xs font-bold text-slate-700">Slot Asesmen Pekan Ini Siap</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 3. CLINICAL ADVANTAGES / KEUNGGULAN                                       -->
	<!-- ========================================================================= -->
	<section class="w-full bg-white py-16 sm:py-20" id="keunggulan">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mx-auto mb-14 max-w-2xl text-center">
				<span class="mb-3 inline-block rounded-full bg-brand-blue-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-blue uppercase">
					KEUNGGULAN HARAPANKU
				</span>
				<h2 class="mb-3 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
					Mengapa Ratusan Orang Tua Mempercayakan Buah Hatinya Kepada Kami?
				</h2>
				<p class="font-body text-sm text-slate-600 sm:text-base">
					Pendekatan holistik yang dirancang secara personal dan berorientasi jangka panjang untuk setiap tahapan usia.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
				<div class="group flex flex-col items-start rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical transition-all hover:-translate-y-1 hover:bg-white hover:shadow-clinical-hover">
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue shadow-xs transition-all group-hover:bg-brand-blue group-hover:text-white">
						<span class="material-symbols-outlined text-[28px]">family_restroom</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Terapi Terintegrasi Komprehensif</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Layanan menyeluruh meliputi Terapi ABA (Perilaku), Wicara, dan Okupasi dalam satu roadmap terpadu tanpa penanganan yang terpisah-pisah, sehingga kemajuan stimulasi lebih terarah.
					</p>
				</div>

				<div class="group flex flex-col items-start rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical transition-all hover:-translate-y-1 hover:bg-white hover:shadow-clinical-hover">
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sage-light text-brand-sage shadow-xs transition-all group-hover:bg-brand-sage group-hover:text-white">
						<span class="material-symbols-outlined text-[28px]">monitoring</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Parent Dashboard Terbuka</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Pemantauan progres anak secara berkala dan real-time langsung melalui smartphone atau laptop Anda tanpa jeda informasi, memberi rasa tenang bagi Ayah dan Bunda.
					</p>
				</div>

				<div class="group flex flex-col items-start rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical transition-all hover:-translate-y-1 hover:bg-white hover:shadow-clinical-hover">
					<div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue shadow-xs transition-all group-hover:bg-brand-blue group-hover:text-white">
						<span class="material-symbols-outlined text-[28px]">clinical_notes</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Terapis Tersertifikasi &amp; Hangat</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Didukung oleh psikolog anak dan tenaga terapis ber-STR Kemenkes resmi, mengutamakan pendekatan bermain yang menyenangkan tanpa rasa takut bagi si kecil.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 4. SERVICES / PROGRAM TERAPI                                              -->
	<!-- ========================================================================= -->
	<section class="w-full border-y border-slate-100 bg-[#f8fafc] py-16 sm:py-20" id="layanan">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div class="max-w-xl">
					<span class="mb-3 inline-block rounded-full bg-brand-blue-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-blue uppercase">
						LAYANAN KLINIS KAMI
					</span>
					<h2 class="mb-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
						Program Terapi Spesifik &amp; Terarah
					</h2>
					<p class="font-body text-sm text-slate-600 sm:text-base">
						Metode klinis teruji untuk mendukung kemandirian gerak, komunikasi aktif, dan ketenangan sensorik buah hati Anda.
					</p>
				</div>
				<button
					type="button"
					onclick={() => openBookingModal()}
					class="inline-flex cursor-pointer items-center gap-2 self-start font-subheading text-sm font-bold text-brand-blue transition-colors hover:text-brand-blue-dark md:self-auto"
				>
					<span>Daftar Konsultasi Sesi Terapi</span>
					<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
				</button>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each data.services as svc, idx (svc.id)}
					{@const isSage = idx % 2 === 1}
					<div class="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-7 shadow-clinical transition-all hover:shadow-clinical-hover">
						<div>
							<div class="mb-4 flex items-center justify-between gap-3">
								<span
									class="rounded-full px-3 py-1 font-subheading text-xs font-bold {isSage
										? 'bg-brand-sage-light text-brand-sage-dark'
										: 'bg-brand-blue-light text-brand-blue'}"
								>
									{svc.categoryLabel}
								</span>
								<span class="flex items-center gap-1 font-subheading text-xs font-semibold text-slate-500">
									<span class="material-symbols-outlined text-[16px]">schedule</span>
									{svc.durationMinutes} Menit
								</span>
							</div>
							<h3 class="mb-2 font-heading text-xl font-bold text-slate-900">{svc.name}</h3>
							<p class="mb-5 font-body text-sm leading-relaxed text-slate-600">{svc.description}</p>
							<ul class="mb-6 space-y-2 font-body text-sm text-slate-700">
								{#each svc.highlights as item}
									<li class="flex items-center gap-2.5">
										<span class="h-1.5 w-1.5 rounded-full {isSage ? 'bg-brand-sage' : 'bg-brand-blue'}"></span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						</div>
						<button
							type="button"
							onclick={() =>
								openBookingModal({
									complaint: mapServiceComplaint(svc.slug, svc.defaultComplaint),
									serviceId: svc.id
								})}
							class="inline-flex cursor-pointer items-center gap-1.5 self-start pt-2 font-subheading text-sm font-bold transition-colors {isSage
								? 'text-brand-sage-dark hover:text-brand-sage'
								: 'text-brand-blue hover:text-brand-blue-dark'}"
						>
							<span>Konsultasikan Kebutuhan Ini</span>
							<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 5. HOW IT WORKS (ALUR TERAPI)                                             -->
	<!-- ========================================================================= -->
	<section class="w-full bg-white py-16 sm:py-20" id="alur">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mx-auto mb-14 max-w-2xl text-center">
				<span class="mb-3 inline-block rounded-full bg-brand-sage-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-sage-dark uppercase">
					ALUR TERAPI KAMI
				</span>
				<h2 class="mb-3 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
					3 Langkah Mudah Menuju Tumbuh Kembang Optimal
				</h2>
				<p class="font-body text-sm text-slate-600 sm:text-base">
					Prosedur terstruktur yang ramah anak dan sepenuhnya transparan bagi keluarga.
				</p>
			</div>

			<div class="relative grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="relative flex flex-col rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical">
					<div class="mb-5 flex items-center justify-between">
						<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue font-heading text-lg font-bold text-white shadow-xs">1</span>
						<span class="font-subheading text-xs font-bold text-brand-blue">Langkah Pertama</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Asesmen Psikologi &amp; Observasi</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Pemeriksaan menyeluruh milestone motorik, kognitif, dan wicara bersama psikolog anak di ruang observasi ramah anak yang nyaman dan penuh mainan edukatif.
					</p>
				</div>

				<div class="relative flex flex-col rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical">
					<div class="mb-5 flex items-center justify-between">
						<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-sage font-heading text-lg font-bold text-white shadow-xs">2</span>
						<span class="font-subheading text-xs font-bold text-brand-sage-dark">Langkah Kedua</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Penyusunan Roadmap Personal</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Tim klinis merumuskan target perkembangan spesifik buah hati bersama orang tua, menentukan kombinasi jadwal terapi yang tepat dan proporsional.
					</p>
				</div>

				<div class="relative flex flex-col rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 shadow-clinical">
					<div class="mb-5 flex items-center justify-between">
						<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-heading text-lg font-bold text-white shadow-xs">3</span>
						<span class="font-subheading text-xs font-bold text-blue-600">Langkah Ketiga</span>
					</div>
					<h3 class="mb-2 font-heading text-lg font-bold text-slate-800">Sesi Terapi &amp; Evaluasi Berkala</h3>
					<p class="font-body text-sm leading-relaxed text-slate-600">
						Sesi terapi 1-on-1 interaktif yang selalu tercatat dalam laporan harian, lengkap dengan evaluasi milestone berkala setiap 12 sesi bersama orang tua.
					</p>
				</div>
			</div>

			<div class="mt-10 text-center">
				<p class="flex items-center justify-center gap-1.5 font-subheading text-xs font-semibold text-slate-500 sm:text-sm">
					<span class="material-symbols-outlined icon-fill text-[18px] text-brand-sage">check_circle</span>
					<span>Semua catatan sesi dapat langsung diakses orang tua di hari yang sama via Parent Dashboard</span>
				</p>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 6. TRANSPARENCY TECHNOLOGY: INTERACTIVE PARENT DASHBOARD PREVIEW          -->
	<!-- ========================================================================= -->
	<section class="relative w-full overflow-hidden bg-[#1e293b] py-16 text-slate-100 sm:py-20" id="dashboard">
		<div class="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl"></div>
		<div class="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-brand-sage/15 blur-3xl"></div>

		<div class="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
				<div class="flex flex-col items-start lg:col-span-6">
					<span class="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/20 px-3.5 py-1 font-subheading text-xs font-bold text-blue-300">
						<span class="material-symbols-outlined text-[16px]">devices</span>
						<span>TEKNOLOGI TRANSPARANSI</span>
					</span>

					<h2 class="mb-4 font-heading text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl">
						Pantau progres anak Anda secara real-time dari mana saja
					</h2>

					<p class="mb-6 font-body text-sm leading-relaxed text-slate-300 sm:text-base">
						Orang tua tidak perlu lagi bertanya-tanya apa yang terjadi di dalam ruang terapi. Akses catatan harian terapis, grafik milestone, dan kurva kemandirian si kecil langsung dari genggaman Anda.
					</p>

					<div class="mb-8 w-full space-y-3 font-body text-sm text-slate-200">
						<div class="flex items-center gap-3">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Grafik perkembangan kompetensi motorik &amp; wicara mingguan</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Catatan evaluasi harian (Daily Therapy Log) terperinci</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="material-symbols-outlined icon-fill text-[20px] text-brand-sage">check_circle</span>
							<span>Rekomendasi stimulasi di rumah (Home Activity Guide)</span>
						</div>
					</div>

					<button
						type="button"
						onclick={() => openBookingModal()}
						class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-subheading text-sm font-bold text-slate-900 shadow-md transition-all hover:bg-slate-100"
					>
						<span class="material-symbols-outlined text-[18px] text-brand-blue">visibility</span>
						<span>Konsultasikan Akses Dashboard</span>
					</button>
				</div>

				<!-- Interactive Dashboard Mockup -->
				<div class="w-full lg:col-span-6">
					<div class="rounded-3xl border border-slate-700/30 bg-white p-6 text-slate-800 shadow-2xl sm:p-7">
						<div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
							<div class="flex items-center gap-3">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light font-heading text-sm font-bold text-brand-blue">
									RF
								</div>
								<div>
									<h4 class="font-heading text-base leading-tight font-bold text-slate-800">Rafa Al-Fatih (3 Th 8 Bln)</h4>
									<span class="font-body text-xs text-slate-500">Terapi Wicara &amp; Sensori Okupasi</span>
								</div>
							</div>
							<span class="rounded-full bg-brand-sage-light px-2.5 py-1 font-subheading text-xs font-bold text-brand-sage-dark">
								Aktif Berprogres
							</span>
						</div>

						<!-- Interactive Tabs -->
						<div class="mb-4 flex gap-2 overflow-x-auto pb-3 font-subheading text-xs font-bold" role="tablist">
							<button
								type="button"
								onclick={() => (activeTab = 'radar')}
								class="cursor-pointer rounded-xl px-3.5 py-2 whitespace-nowrap transition-all {activeTab === 'radar'
									? 'bg-brand-blue text-white shadow-xs'
									: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
							>
								Milestone Radar
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'session')}
								class="cursor-pointer rounded-xl px-3.5 py-2 whitespace-nowrap transition-all {activeTab === 'session'
									? 'bg-brand-blue text-white shadow-xs'
									: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
							>
								Sesi Terakhir (Daily Log)
							</button>
							<button
								type="button"
								onclick={() => (activeTab = 'goals')}
								class="cursor-pointer rounded-xl px-3.5 py-2 whitespace-nowrap transition-all {activeTab === 'goals'
									? 'bg-brand-blue text-white shadow-xs'
									: 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
							>
								Target Bulan Ini
							</button>
						</div>

						{#if activeTab === 'radar'}
							<div class="space-y-4">
								<div class="space-y-3">
									<div>
										<div class="mb-1 flex justify-between font-subheading text-xs font-bold">
											<span class="text-slate-700">Keterampilan Wicara Ekspresif</span>
											<span class="text-brand-blue">82%</span>
										</div>
										<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
											<div class="h-full rounded-full bg-brand-blue transition-all duration-700" style="width: 82%"></div>
										</div>
									</div>
									<div>
										<div class="mb-1 flex justify-between font-subheading text-xs font-bold">
											<span class="text-slate-700">Sensori Integrasi &amp; Fokus</span>
											<span class="text-brand-sage-dark">75%</span>
										</div>
										<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
											<div class="h-full rounded-full bg-brand-sage transition-all duration-700" style="width: 75%"></div>
										</div>
									</div>
									<div>
										<div class="mb-1 flex justify-between font-subheading text-xs font-bold">
											<span class="text-slate-700">Koordinasi Motorik Halus (Genggaman)</span>
											<span class="text-amber-600">88%</span>
										</div>
										<div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
											<div class="h-full rounded-full bg-amber-500 transition-all duration-700" style="width: 88%"></div>
										</div>
									</div>
								</div>

								<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
									<div class="mb-1.5 flex items-center justify-between">
										<span class="font-subheading text-xs font-semibold text-slate-500">Tren Kemandirian 8 Pekan</span>
										<span class="font-subheading text-xs font-bold text-brand-sage-dark">+28% Peningkatan</span>
									</div>
									<svg class="h-12 w-full text-brand-blue" fill="none" preserveAspectRatio="none" viewBox="0 0 300 50">
										<path d="M0,42 Q40,36 75,32 T150,22 T225,14 T300,6" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"></path>
										<path d="M0,42 Q40,36 75,32 T150,22 T225,14 T300,6 L300,50 L0,50 Z" fill="currentColor" fill-opacity="0.1"></path>
										<circle cx="300" cy="6" fill="currentColor" r="3.5"></circle>
									</svg>
								</div>

								<div class="flex items-start gap-2.5 rounded-2xl border border-brand-blue-light bg-brand-blue-light/40 p-3">
									<span class="material-symbols-outlined icon-fill mt-0.5 flex-shrink-0 text-[20px] text-brand-blue">verified</span>
									<div class="flex flex-col">
										<span class="font-subheading text-xs font-bold text-slate-800">Catatan Sesi Hari Ini (14:30 WITA):</span>
										<p class="mt-0.5 font-body text-xs text-slate-600">
											“Ananda Rafa sangat antusias merespon 8 instruksi kata baru dan berhasil menyusun balok tanpa rasa jenuh.”
										</p>
										<span class="mt-1 font-subheading text-[11px] font-semibold text-brand-blue">Terapis: Kak Sarah Novita, S.Psi.</span>
									</div>
								</div>
							</div>
						{:else if activeTab === 'session'}
							<div class="space-y-3 font-body text-xs">
								<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
									<div class="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
										<span class="font-subheading font-bold text-slate-800">Sesi #14: Terapi Wicara &amp; Artikulasi</span>
										<span class="text-[11px] text-slate-500">Hari ini, 14:00 - 14:45 WITA</span>
									</div>
									<div class="space-y-2 text-slate-700">
										<div>
											<span class="font-bold text-slate-800">Fokus Stimulasi:</span>
											<p class="mt-0.5 text-slate-600">
												Fonem bilabial /b/, /m/, /p/ dengan bantuan kartu bergambar Montessori &amp; cermin artikulasi.
											</p>
										</div>
										<div>
											<span class="font-bold text-slate-800">Respon Emosional:</span>
											<span class="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
												Ceria &amp; Sangat Kooperatif
											</span>
										</div>
									</div>
								</div>

								<div class="rounded-2xl border border-brand-sage/20 bg-brand-sage-light/40 p-3.5">
									<div class="mb-1.5 flex items-center gap-2">
										<span class="material-symbols-outlined text-[18px] text-brand-sage">home_health</span>
										<span class="font-subheading font-bold text-slate-800">Rekomendasi Latihan di Rumah (Home Stimulation):</span>
									</div>
									<ul class="space-y-1.5 pl-1 text-slate-600">
										<li class="flex items-start gap-1.5">
											<span class="font-bold text-brand-sage">•</span>
											<span>Ajak Rafa menyebut nama benda sebelum memberikan (contoh: "Mau minum air? Sebut 'Air'").</span>
										</li>
										<li class="flex items-start gap-1.5">
											<span class="font-bold text-brand-sage">•</span>
											<span>Lakukan tiup gelembung sabun 5 menit untuk melatih kekuatan bibir.</span>
										</li>
									</ul>
								</div>
							</div>
						{:else}
							<div class="space-y-3">
								<div class="flex items-center justify-between pb-1 text-xs">
									<span class="font-subheading font-bold text-brand-blue">
										{achievedCount} dari {demoTargets.length} Target Tercapai ({achievedPct}%)
									</span>
									<span class="text-[11px] text-slate-400">Klik checkbox untuk tes interaksi</span>
								</div>

								<div class="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
									<div class="h-full rounded-full bg-brand-sage transition-all duration-300" style="width: {achievedPct}%"></div>
								</div>

								<div class="space-y-2 text-xs">
									{#each demoTargets as target (target.id)}
										<label
											class="flex cursor-pointer items-start gap-3 rounded-xl border p-2.5 transition {target.done
												? 'border-brand-sage/30 bg-brand-sage-light/40'
												: 'border-slate-100 bg-slate-50'}"
										>
											<input
												type="checkbox"
												bind:checked={target.done}
												class="mt-0.5 rounded text-brand-sage accent-brand-sage"
											/>
											<div class="flex flex-col">
												<span class="font-subheading font-bold text-slate-800">{target.title}</span>
												<span class="text-[11px] {target.done ? 'text-slate-500' : 'text-amber-600'}">{target.note}</span>
											</div>
										</label>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 7. CLINIC FACILITIES GALLERY                                              -->
	<!-- ========================================================================= -->
	<section class="w-full border-t border-slate-100 bg-white py-16 sm:py-20" id="fasilitas">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mx-auto mb-14 max-w-2xl text-center">
				<span class="mb-3 inline-block rounded-full bg-brand-sage-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-sage-dark uppercase">
					FASILITAS KLINIK
				</span>
				<h2 class="mb-3 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
					Fasilitas Ramah Anak &amp; Nyaman Seperti di Rumah
				</h2>
				<p class="font-body text-sm leading-relaxed text-slate-600 sm:text-base">
					Ruang terapi dirancang khusus dengan standar higienis dan terapeutik internasional agar anak merasa riang dan bebas dari rasa cemas.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-[#f8fafc] shadow-clinical transition-all hover:-translate-y-1 hover:shadow-clinical-hover">
					<div class="relative aspect-[4/3] w-full overflow-hidden">
						<img
							src="/assets/images/fasilitas-sensori-integrasi.png"
							alt="Ruang Sensori Integrasi Klinik Harapanku"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<span class="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-subheading text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
							<span class="h-2 w-2 rounded-full bg-brand-sage"></span>
							Sensori Integrasi
						</span>
					</div>
					<div class="flex flex-grow flex-col justify-between p-6 sm:p-7">
						<div>
							<h3 class="mb-2 font-heading text-lg font-bold text-slate-900">Ruang Sensori Integrasi (SI)</h3>
							<p class="font-body text-sm leading-relaxed text-slate-600">
								Lengkap dengan sensory swing (ayunan terapi), matras pengaman bertaraf medis, dan tactile wall untuk melatih regulasi keseimbangan motorik si kecil.
							</p>
						</div>
						<div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 font-subheading text-xs font-semibold text-brand-sage-dark">
							<span class="material-symbols-outlined text-[16px]">verified</span>
							<span>Higienis &amp; Aman Standar Medis</span>
						</div>
					</div>
				</div>

				<div class="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-[#f8fafc] shadow-clinical transition-all hover:-translate-y-1 hover:shadow-clinical-hover">
					<div class="relative aspect-[4/3] w-full overflow-hidden">
						<img
							src="/assets/images/fasilitas-terapi-wicara.png"
							alt="Ruang Terapi Wicara dan Artikulasi Klinik Harapanku"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<span class="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-subheading text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
							<span class="h-2 w-2 rounded-full bg-brand-blue"></span>
							Wicara &amp; Bahasa
						</span>
					</div>
					<div class="flex flex-grow flex-col justify-between p-6 sm:p-7">
						<div>
							<h3 class="mb-2 font-heading text-lg font-bold text-slate-900">Ruang Terapi Wicara &amp; Artikulasi</h3>
							<p class="font-body text-sm leading-relaxed text-slate-600">
								Meja ergonomis kayu ramah anak, cermin artikulasi interaktif, flashcards kosakata, dan instrumen oral motor dalam ruangan yang tenang bebas kebisingan.
							</p>
						</div>
						<div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 font-subheading text-xs font-semibold text-brand-blue">
							<span class="material-symbols-outlined text-[16px]">record_voice_over</span>
							<span>Kedap Suara &amp; Bebas Distraksi</span>
						</div>
					</div>
				</div>

				<div class="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-[#f8fafc] shadow-clinical transition-all hover:-translate-y-1 hover:shadow-clinical-hover">
					<div class="relative aspect-[4/3] w-full overflow-hidden">
						<img
							src="/assets/images/fasilitas-ruang-observasi.png"
							alt="Ruang Observasi dan Konsultasi Orang Tua Klinik Harapanku"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<span class="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-subheading text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
							<span class="h-2 w-2 rounded-full bg-amber-500"></span>
							Konsultasi Keluarga
						</span>
					</div>
					<div class="flex flex-grow flex-col justify-between p-6 sm:p-7">
						<div>
							<h3 class="mb-2 font-heading text-lg font-bold text-slate-900">Ruang Observasi &amp; Konsultasi Ortu</h3>
							<p class="font-body text-sm leading-relaxed text-slate-600">
								Dilengkapi area bermain Montessori dan sofa keluarga yang nyaman untuk diskusi santai 1-on-1 bersama psikolog anak dan tim terapis.
							</p>
						</div>
						<div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 font-subheading text-xs font-semibold text-brand-sage-dark">
							<span class="material-symbols-outlined text-[16px]">family_restroom</span>
							<span>Privasi Terjamin &amp; Suasana Tenang</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 8. TRANSPARENT PRICING PACKAGES                                           -->
	<!-- ========================================================================= -->
	<section class="w-full border-y border-slate-100 bg-[#f8fafc] py-16 sm:py-20" id="paket-asesmen">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mx-auto mb-14 max-w-2xl text-center">
				<span class="mb-3 inline-block rounded-full bg-brand-blue-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-blue uppercase">
					Investasi Tumbuh Kembang Buah Hati
				</span>
				<h2 class="mb-3 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
					Pilihan Paket Asesmen Awal yang Transparan
				</h2>
				<p class="font-body text-sm leading-relaxed text-slate-600 sm:text-base">
					Tanpa biaya tersembunyi. Dapatkan evaluasi objektif dan rencana penanganan berbasis bukti klinis.
				</p>
			</div>

			<!-- Self-Screening Callout Banner -->
			<div class="mx-auto mb-10 flex max-w-4xl flex-col items-center justify-between gap-5 rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-50 via-white to-amber-50 p-6 shadow-xs sm:flex-row sm:p-7">
				<div class="flex items-start gap-4">
					<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-2xl text-teal-700 shadow-xs">
						🌱
					</div>
					<div>
						<div class="flex items-center gap-2">
							<h3 class="font-heading text-base font-bold text-slate-900 sm:text-lg">
								Ingin Cek Mandiri di Rumah Dahulu?
							</h3>
							<span class="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
								Gratis &amp; Empatik
							</span>
						</div>
						<p class="mt-1 font-body text-xs leading-relaxed text-slate-600 sm:text-sm">
							Gunakan platform skrining mandiri 3-5 menit berbasis <strong>Denver II &amp; M-CHAT-R/F</strong> dengan kalkulator usia koreksi prematur dan roadmap stimulasi 14 hari di rumah.
						</p>
					</div>
				</div>
				<a
					href="/skrining"
					class="inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-subheading text-xs font-bold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 sm:w-auto sm:text-sm"
				>
					<span>Mulai Skrining Mandiri</span>
					<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
				</a>
			</div>

			<div class="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-2">
				{#each data.packages as pkg (pkg.id)}
					<div
						class="relative flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-8 {pkg.isRecommended
							? 'border-2 border-brand-blue shadow-[0_16px_40px_rgba(74,144,226,0.12)]'
							: 'border border-slate-200 shadow-clinical transition-all hover:shadow-clinical-hover'}"
					>
						{#if pkg.isRecommended}
							<div class="absolute -top-3.5 right-6 flex items-center gap-1.5 rounded-full bg-brand-orange px-4 py-1 font-subheading text-xs font-bold text-white shadow-sm">
								<span class="material-symbols-outlined icon-fill text-[14px]">star</span>
								<span>Paling Direkomendasikan</span>
							</div>
						{/if}

						<div>
							<div class="mb-4">
								<span
									class="mb-2 inline-block rounded-full px-3.5 py-1 font-subheading text-xs font-bold {pkg.isRecommended
										? 'bg-brand-blue-light text-brand-blue'
										: 'bg-slate-100 text-slate-700'}"
								>
									{pkg.isRecommended ? 'Comprehensive Assessment' : 'Basic Screening'}
								</span>
								<h3 class="mb-1 font-heading text-2xl font-bold text-slate-900">{pkg.name}</h3>
								<p class="font-body text-xs text-slate-500">
									{pkg.isRecommended
										? 'Pemeriksaan mendalam holistik oleh Psikolog Anak & Terapis Spesialis'
										: 'Ideal untuk deteksi dini tanda-tanda keterlambatan usia 1-4 tahun'}
								</p>
							</div>

							<div class="mb-6 flex items-baseline gap-2 border-b border-slate-100 pb-6">
								<span class="font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
									Rp {formatRupiah(pkg.priceIdr)}
								</span>
								<span class="font-subheading text-xs font-semibold text-slate-500">
									{pkg.isRecommended ? '/ anak (paket lengkap)' : '/ anak (sekali sesi)'}
								</span>
							</div>

							<ul class="mb-8 space-y-3.5 font-body text-sm text-slate-700">
								{#each pkg.features as feat}
									<li class="flex items-start gap-3">
										<span
											class="material-symbols-outlined icon-fill mt-0.5 flex-shrink-0 text-[20px] {pkg.isRecommended
												? 'text-brand-sage-dark'
												: 'text-brand-blue'}"
										>
											check_circle
										</span>
										<span>{feat}</span>
									</li>
								{/each}
							</ul>
						</div>

						<button
							type="button"
							onclick={() =>
								openBookingModal({
									packageLabel: `${pkg.name} (Rp ${formatRupiah(pkg.priceIdr)})`,
									packageId: pkg.id
								})}
							class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-subheading text-sm font-bold transition-all {pkg.isRecommended
								? 'bg-brand-orange text-white shadow-[0_6px_20px_rgba(245,166,35,0.35)] hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_8px_24px_rgba(245,166,35,0.45)]'
								: 'border border-brand-blue-light bg-brand-blue-light text-brand-blue hover:bg-brand-blue hover:text-white'}"
						>
							{#if pkg.isRecommended}
								<span class="material-symbols-outlined text-[20px]">calendar_month</span>
								<span>Jadwalkan Asesmen Lengkap</span>
							{:else}
								<span>Pilih Screening Dasar</span>
								<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
							{/if}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 9. FAQ ACCORDION                                                          -->
	<!-- ========================================================================= -->
	<section class="w-full bg-white py-16 sm:py-20" id="faq">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="mx-auto mb-14 max-w-2xl text-center">
				<span class="mb-3 inline-block rounded-full bg-brand-blue-light px-3.5 py-1 font-subheading text-xs font-extrabold tracking-wider text-brand-blue uppercase">
					Bantuan &amp; Informasi
				</span>
				<h2 class="mb-3 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
					Pertanyaan Seputar Layanan Harapanku
				</h2>
				<p class="font-body text-sm leading-relaxed text-slate-600 sm:text-base">
					Temukan jawaban atas hal yang paling sering ditanyakan oleh Ayah dan Bunda sebelum memulai proses asesmen.
				</p>
			</div>

			<div class="mx-auto max-w-3xl space-y-4">
				{#each faqs as faq, idx}
					<div class="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 transition-all duration-300 sm:p-6">
						<button
							type="button"
							onclick={() => (openFaq = openFaq === idx ? null : idx)}
							class="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-heading text-base font-bold text-slate-800 sm:text-lg"
						>
							<span>{faq.q}</span>
							<span class="material-symbols-outlined flex-shrink-0 text-[20px] text-slate-400 transition-transform {openFaq === idx ? 'rotate-180' : ''}">
								expand_more
							</span>
						</button>
						{#if openFaq === idx}
							<div class="mt-4 border-t border-slate-100 pt-4 font-body text-sm leading-relaxed text-slate-600">
								{faq.a}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-brand-blue-light bg-brand-blue-light/50 p-6 sm:flex-row">
				<div class="flex items-center gap-3 text-center sm:text-left">
					<span class="material-symbols-outlined flex-shrink-0 text-[28px] text-brand-blue">support_agent</span>
					<div>
						<h4 class="font-subheading text-sm font-bold text-slate-800">Punya pertanyaan khusus mengenai si kecil?</h4>
						<p class="font-body text-xs text-slate-600">Care Coordinator kami siap berdiskusi santai dan memberikan panduan awal.</p>
					</div>
				</div>
				<a
					href="https://wa.me/628115400992?text=Halo%20Care%20Coordinator%20Klinik%20Harapanku%2C%20saya%20ingin%20konsultasi%20singkat%20mengenai%20anak%20saya"
					target="_blank"
					rel="noopener"
					class="rounded-xl bg-brand-blue px-5 py-2.5 font-subheading text-xs font-bold whitespace-nowrap text-white transition-all hover:bg-brand-blue-dark"
				>
					Chat WhatsApp
				</a>
			</div>
		</div>
	</section>

	<!-- ========================================================================= -->
	<!-- 10. FINAL CALL TO ACTION                                                  -->
	<!-- ========================================================================= -->
	<section class="w-full bg-[#f8fafc] py-16 sm:py-20">
		<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
			<div class="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-[#eff6ff] to-emerald-50/50 p-8 text-center shadow-sm sm:p-12">
				<div class="mx-auto flex max-w-2xl flex-col items-center">
					<span class="mb-3 rounded-full border border-blue-100 bg-white px-4 py-1 font-subheading text-xs font-bold text-brand-blue shadow-xs">
						Langkah Awal Penuh Harapan
					</span>
					<h2 class="mb-3 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
						Beri Hadiah Terbaik untuk Masa Depan Buah Hati Anda
					</h2>
					<p class="mb-8 max-w-xl font-body text-sm text-slate-600 sm:text-base">
						Intervensi sedini mungkin membawa dampak perubahan optimal bagi kemandirian dan kebahagiaan anak. Amankan jadwal observasi awal bersama tim dokter dan psikolog kami hari ini.
					</p>

					<div class="mb-4 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
						<button
							type="button"
							onclick={() => openBookingModal()}
							class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-orange px-8 py-4 font-subheading text-base font-extrabold text-white shadow-[0_8px_24px_rgba(245,166,35,0.35)] transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_12px_28px_rgba(245,166,35,0.45)] sm:w-auto"
						>
							<span class="material-symbols-outlined text-[22px]">calendar_month</span>
							<span>Daftar Asesmen Awal Sekarang</span>
						</button>
						<a
							href="https://wa.me/628115400992?text=Halo%20Klinik%20Harapanku%2C%20saya%20ingin%20konsultasi%20awal%20melalui%20WhatsApp"
							target="_blank"
							rel="noopener"
							class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-subheading text-base font-bold text-brand-sage-dark shadow-xs transition-colors hover:bg-slate-50 sm:w-auto"
						>
							<span class="material-symbols-outlined text-[20px] text-brand-sage">chat</span>
							<span>Konsultasi WhatsApp</span>
						</a>
					</div>

					<p class="flex items-center justify-center gap-1 font-subheading text-xs font-semibold text-slate-500">
						<span class="material-symbols-outlined text-[16px] text-amber-500">schedule</span>
						<span>Slot asesmen tatap muka dibatasi per hari demi menjaga keheningan &amp; kenyamanan anak.</span>
					</p>
				</div>
			</div>
		</div>
	</section>
</main>

<!-- ========================================================================= -->
<!-- 11. FOOTER                                                                -->
<!-- ========================================================================= -->
<footer class="w-full border-t border-slate-100 bg-white pt-16 pb-12">
	<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
		<div class="grid grid-cols-1 gap-8 border-b border-slate-100 pb-12 md:grid-cols-12">
			<div class="flex flex-col gap-4 md:col-span-4">
				<img src="/assets/images/logo.png" alt="Harapanku Clinic Logo" class="h-9 w-auto self-start object-contain" />
				<p class="max-w-sm font-body text-sm leading-relaxed text-slate-600">
					Pusat layanan terapi dan stimulasi tumbuh kembang anak terpadu di Balikpapan. Pendekatan ramah anak, transparan, dan berbasis bukti klinis.
				</p>
				<div class="pt-1">
					<a
						href="https://wa.me/628115400992"
						target="_blank"
						rel="noopener"
						class="inline-flex items-center gap-2 rounded-xl border border-brand-sage/20 bg-brand-sage-light/70 px-4 py-2 font-subheading text-xs font-bold text-brand-sage-dark transition-colors hover:bg-brand-sage-light"
					>
						<span class="material-symbols-outlined text-[18px] text-brand-sage">chat</span>
						<span>WhatsApp Resmi: +62 811-5400-992</span>
					</a>
				</div>
			</div>

			<div class="flex flex-col gap-3 md:col-span-3">
				<h4 class="font-heading text-base font-bold text-slate-900">Alamat Klinik</h4>
				<div class="flex items-start gap-2 font-body text-sm text-slate-600">
					<span class="material-symbols-outlined mt-0.5 text-[20px] text-brand-blue">location_on</span>
					<span>Jl. MT Haryono No. 88, Balikpapan Selatan, Kalimantan Timur 76114</span>
				</div>
				<div class="flex items-center gap-2 font-body text-sm text-slate-600">
					<span class="material-symbols-outlined text-[20px] text-brand-blue">call</span>
					<span>(0542) 876-209</span>
				</div>
			</div>

			<div class="flex flex-col gap-3 md:col-span-3">
				<h4 class="font-heading text-base font-bold text-slate-900">Jam Layanan</h4>
				<div class="flex items-start gap-2 font-body text-sm text-slate-600">
					<span class="material-symbols-outlined mt-0.5 text-[20px] text-brand-sage">schedule</span>
					<div class="flex flex-col">
						<span class="font-semibold text-slate-800">Senin – Sabtu:</span>
						<span>08:00 – 17:00 WITA</span>
						<span class="mt-1 font-semibold text-slate-800">Minggu:</span>
						<span>Khusus Reservasi Khusus</span>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3 md:col-span-2">
				<h4 class="font-heading text-base font-bold text-slate-900">Navigasi Cepat</h4>
				<ul class="flex flex-col gap-2 font-subheading text-xs font-semibold text-slate-600">
					<li><a href="#layanan" class="transition-colors hover:text-brand-blue">Layanan Terapi</a></li>
					<li><a href="#alur" class="transition-colors hover:text-brand-blue">Alur Konsultasi</a></li>
					<li><a href="#dashboard" class="transition-colors hover:text-brand-blue">Parent Dashboard</a></li>
					<li><a href="#fasilitas" class="transition-colors hover:text-brand-blue">Fasilitas Klinik</a></li>
					<li><a href="#paket-asesmen" class="transition-colors hover:text-brand-blue">Paket &amp; Biaya</a></li>
				</ul>
			</div>
		</div>

		<div class="flex flex-col items-center justify-between gap-4 pt-8 text-center font-body text-xs text-slate-500 sm:flex-row sm:text-left">
			<p>&copy; 2026 Klinik Tumbuh Kembang Harapanku. Seluruh hak cipta dilindungi.</p>
			<div class="flex items-center gap-6 font-subheading font-medium">
				<a href="/login" class="transition-colors hover:text-brand-blue">Masuk Portal</a>
				<a href="/skrining" class="transition-colors hover:text-brand-blue">Skrining Mandiri</a>
			</div>
		</div>
	</div>
</footer>

<!-- Floating WhatsApp Button -->
<a
	href="https://wa.me/628115400992?text=Halo%20Klinik%20Harapanku%2C%20saya%20ingin%20tanya%20jadwal%20asesmen"
	target="_blank"
	rel="noopener"
	class="fixed right-6 bottom-6 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 font-subheading text-sm font-bold text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#20ba59] hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)]"
	title="Chat WhatsApp Harapanku"
>
	<span class="material-symbols-outlined text-[20px]">chat</span>
	<span class="hidden sm:inline">Tanya Kami</span>
</a>

<!-- ========================================================================= -->
<!-- 13. QUICK ASSESSMENT MODAL POPUP                                          -->
<!-- ========================================================================= -->
{#if isModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			aria-label="Tutup Dialog"
			onclick={() => (isModalOpen = false)}
			class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
		></button>

		<div class="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
			<div class="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-brand-blue via-brand-sage to-brand-orange"></div>

			<button
				type="button"
				onclick={() => (isModalOpen = false)}
				aria-label="Tutup Dialog"
				class="absolute top-5 right-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
			>
				<span class="material-symbols-outlined text-[20px]">close</span>
			</button>

			{#if form?.success}
				<div class="py-6 text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-sage-light text-brand-sage">
						<span class="material-symbols-outlined icon-fill text-[36px]">check_circle</span>
					</div>
					<h4 class="mb-2 font-heading text-xl font-bold text-slate-900">Terima Kasih, Ayah/Bunda!</h4>
					<p class="mx-auto mb-6 max-w-sm font-body text-sm leading-relaxed text-slate-600">
						Permintaan asesmen awal telah kami simpan. Silakan klik tombol di bawah untuk melanjutkan obrolan dengan Care Coordinator kami.
					</p>
					<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
						<a
							href={form.waUrl}
							target="_blank"
							rel="noopener"
							class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-2.5 font-subheading text-sm font-bold text-white transition-all hover:bg-[#20ba59] sm:w-auto"
						>
							<span class="material-symbols-outlined text-[18px]">chat</span>
							<span>Buka Chat WhatsApp</span>
						</a>
						<button
							type="button"
							onclick={() => (isModalOpen = false)}
							class="w-full cursor-pointer rounded-xl bg-slate-100 px-6 py-2.5 font-subheading text-sm font-bold text-slate-700 transition-all hover:bg-slate-200 sm:w-auto"
						>
							Tutup Dialog
						</button>
					</div>
				</div>
			{:else}
				<div class="mb-3 flex flex-wrap items-center gap-2">
					<div class="inline-flex items-center gap-1.5 rounded-full bg-brand-sage-light px-3 py-1 font-subheading text-xs font-bold text-brand-sage-dark">
						<span class="material-symbols-outlined icon-fill text-[15px] text-brand-sage">check_circle</span>
						<span>Zero Waiting List • Terjadwal Cepat</span>
					</div>
					{#if selectedPackageLabel}
						<div class="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-light px-3 py-1 font-subheading text-xs font-bold text-brand-blue">
							<span class="material-symbols-outlined text-[15px]">inventory_2</span>
							<span>{selectedPackageLabel}</span>
						</div>
					{/if}
				</div>

				<h3 class="mb-1 font-heading text-xl leading-snug font-extrabold text-slate-900 sm:text-2xl">
					Jadwalkan Konsultasi &amp; Asesmen Awal
				</h3>
				<p class="mb-6 font-body text-xs text-slate-500 sm:text-sm">
					Isi 4 informasi ringkas di bawah ini. Tim spesialis kami siap mendampingi kebutuhan buah hati tercinta.
				</p>

				{#if form?.error}
					<p class="mb-3 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{form.error}</p>
				{/if}

				<form
					method="POST"
					action="?/book"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-4"
				>
					<input type="hidden" name="serviceId" value={selectedServiceId ?? ''} />
					<input type="hidden" name="packageId" value={selectedPackageId ?? ''} />

					<div>
						<label for="parentName" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
							1. Nama Lengkap Orang Tua (Ayah / Bunda) <span class="text-rose-500">*</span>
						</label>
						<input
							id="parentName"
							name="parentName"
							type="text"
							required
							placeholder="Contoh: Bunda Nadia Putri"
							class="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-body text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
						/>
					</div>

					<div>
						<label for="childAgeLabel" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
							2. Usia Anak Saat Ini <span class="text-rose-500">*</span>
						</label>
						<input
							id="childAgeLabel"
							name="childAgeLabel"
							type="text"
							required
							placeholder="Contoh: 2 tahun 6 bulan"
							class="w-full rounded-xl border border-slate-200 px-4 py-2.5 font-body text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
						/>
					</div>

					<div>
						<label for="mainComplaint" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
							3. Fokus / Keluhan Utama <span class="text-rose-500">*</span>
						</label>
						<select
							id="mainComplaint"
							name="mainComplaint"
							required
							bind:value={selectedComplaint}
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-body text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
						>
							<option value="" disabled>Pilih kebutuhan perhatian si kecil...</option>
							<option value="Speech Delay / Terlambat Bicara">Speech Delay / Terlambat Bicara</option>
							<option value="Tantrum & Fokus Perilaku (ABA)">Tantrum &amp; Fokus Perilaku (ABA)</option>
							<option value="Koordinasi Sensori & Motorik (Okupasi)">Koordinasi Sensori &amp; Motorik (Okupasi)</option>
							<option value="Belum Tahu Pasti / Butuh Observasi Umum">Belum Tahu Pasti / Butuh Observasi Umum</option>
						</select>
					</div>

					<div>
						<label for="parentWa" class="mb-1 block font-subheading text-xs font-bold text-slate-700">
							4. Nomor WhatsApp Aktif <span class="text-rose-500">*</span>
						</label>
						<div class="relative">
							<span class="absolute top-2.5 left-3.5 font-body text-xs font-semibold text-slate-400">+62</span>
							<input
								id="parentWa"
								name="parentWa"
								type="tel"
								required
								placeholder="812-3456-7890"
								class="w-full rounded-xl border border-slate-200 py-2.5 pr-4 pl-12 font-body text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
							/>
						</div>
					</div>

					<div class="flex items-start gap-2.5 rounded-xl border border-brand-blue-light bg-brand-blue-light/50 p-3">
						<span class="material-symbols-outlined mt-0.5 flex-shrink-0 text-[18px] text-brand-blue">favorite</span>
						<p class="font-body text-[11px] leading-relaxed text-slate-600">
							Pendataan lanjutan dan rekam observasi akan dipandu langsung secara personal via WhatsApp oleh Care Coordinator kami, agar Bunda/Ayah tidak perlu repot mengisi form panjang.
						</p>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 font-subheading text-sm font-extrabold text-white shadow-[0_6px_20px_rgba(245,166,35,0.35)] transition-all hover:bg-brand-orange-hover hover:shadow-[0_8px_24px_rgba(245,166,35,0.45)] disabled:opacity-60"
					>
						<span class="material-symbols-outlined text-[20px]">send</span>
						<span>{isSubmitting ? 'Menyimpan...' : 'Kirim & Hubungkan ke WhatsApp'}</span>
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}
