<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let paragraphs = $derived(
		data.article.content
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
	);

	function formatTanggal(iso: string) {
		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) return iso;
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>{data.article.title} — Artikel Harapanku</title>
	<meta name="description" content={data.article.abstract} />
</svelte:head>

<!-- Header Navigation -->
<header class="fixed top-0 left-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
		<a href="/" class="flex items-center gap-3" title="Kembali ke Beranda Harapanku">
			<img src="/assets/images/logo.png" alt="Klinik Tumbuh Kembang Harapanku" class="h-10 w-auto object-contain sm:h-11" />
		</a>
		<div class="flex items-center gap-3">
			<a
				href="/#articles"
				class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 font-subheading text-xs font-bold text-slate-700 transition hover:border-brand-blue hover:text-brand-blue sm:text-sm"
			>
				<span class="material-symbols-outlined text-[18px]">arrow_back</span>
				<span>Semua Artikel</span>
			</a>
			<a
				href="/skrining"
				class="inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-4 py-2 font-subheading text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 sm:text-sm"
			>
				<span>Skrining Mandiri</span>
			</a>
		</div>
	</div>
</header>

<main class="min-h-screen bg-[#F8FBFF] pt-28 pb-20">
	<article class="mx-auto max-w-4xl px-5 sm:px-8">
		<!-- Breadcrumb -->
		<nav aria-label="Breadcrumb" class="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
			<a href="/" class="hover:text-brand-blue">Beranda</a>
			<span>/</span>
			<a href="/#articles" class="hover:text-brand-blue">Articles</a>
			<span>/</span>
			<span class="line-clamp-1 text-slate-700">{data.article.title}</span>
		</nav>

		<div class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-clinical">
			<!-- Cover Image -->
			<div class="aspect-[16/9] w-full overflow-hidden bg-slate-100">
				<img
					src={data.article.imageUrl}
					alt={data.article.title}
					class="h-full w-full object-cover"
				/>
			</div>

			<div class="p-6 sm:p-10 lg:p-12">
				<!-- Tags -->
				{#if data.article.tags.length > 0}
					<div class="mb-4 flex flex-wrap gap-2">
						{#each data.article.tags as tag}
							<span class="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-subheading text-xs font-bold text-brand-blue">
								<span>#</span>{tag}
							</span>
						{/each}
					</div>
				{/if}

				<!-- Title -->
				<h1 class="mb-5 font-heading text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
					{data.article.title}
				</h1>

				<!-- Metadata: Author, Date, Viewer -->
				<div class="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-slate-100 py-4 text-xs font-semibold text-slate-600 sm:text-sm">
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-[19px] text-brand-blue">person</span>
						<span>Penulis: <strong class="text-slate-900">{data.article.authorName}</strong></span>
					</div>
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-[19px] text-brand-blue">calendar_today</span>
						<span>{formatTanggal(data.article.publishedAt)}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-[19px] text-brand-blue">visibility</span>
						<span><strong class="text-slate-900">{data.article.viewCount.toLocaleString('id-ID')}</strong> pembaca</span>
					</div>
				</div>

				<!-- Abstract Highlight -->
				<div class="mb-8 rounded-2xl border-l-4 border-brand-blue bg-[#F4F8FF] p-5">
					<p class="font-body text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
						{data.article.abstract}
					</p>
				</div>

				<!-- Full Content -->
				<div class="space-y-5 font-body text-base leading-relaxed text-slate-700 sm:text-[17px]">
					{#each paragraphs as para}
						<p class="whitespace-pre-line">{para}</p>
					{/each}
				</div>

				<!-- Clinical CTA Box -->
				<div class="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-[#EFF6FF] to-[#F8FBFF] p-6 sm:flex-row sm:items-center">
					<div>
						<h2 class="font-heading text-base font-bold text-slate-900 sm:text-lg">
							Ingin memeriksa tahap perkembangan buah hati?
						</h2>
						<p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
							Coba Skrining Mandiri gratis 3–5 menit atau jadwalkan asesmen awal bersama tim Harapanku.
						</p>
					</div>
					<div class="flex flex-wrap gap-2.5">
						<a
							href="/skrining"
							class="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2.5 font-subheading text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
						>
							<span>Cek Skrining Mandiri</span>
						</a>
						<a
							href="/#paket-asesmen"
							class="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-subheading text-xs font-bold text-brand-blue transition hover:bg-blue-50"
						>
							<span>Lihat Paket Asesmen</span>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Related Articles -->
		{#if data.relatedArticles.length > 0}
			<section class="mt-14">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="font-heading text-xl font-bold text-slate-900 sm:text-2xl">Artikel Lainnya</h2>
					<a href="/#articles" class="text-xs font-bold text-brand-blue hover:underline sm:text-sm">
						Lihat Semua &rarr;
					</a>
				</div>
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.relatedArticles as rel (rel.slug)}
						<a
							href={`/articles/${rel.slug}`}
							class="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
						>
							<div class="aspect-[16/10] w-full overflow-hidden bg-slate-100">
								<img
									src={rel.imageUrl}
									alt={rel.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
							<div class="flex flex-grow flex-col p-5">
								<h3 class="mb-2 line-clamp-2 font-heading text-base font-bold text-slate-900 group-hover:text-brand-blue">
									{rel.title}
								</h3>
								<p class="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-600">
									{rel.abstract}
								</p>
								<span class="mt-auto inline-flex items-center gap-1 text-xs font-bold text-brand-blue">
									Read More
									<span class="material-symbols-outlined text-[15px]">arrow_forward</span>
								</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</article>
</main>

<footer class="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
	<div class="mx-auto max-w-[1240px] px-5 sm:px-8">
		<p>{data.cms.footer.copyright}</p>
	</div>
</footer>
