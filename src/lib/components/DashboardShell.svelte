<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface NavItem {
		label: string;
		icon: string;
		href?: string;
		active?: boolean;
		onclick?: () => void;
	}

	let {
		title,
		subtitle = '',
		roleLabel,
		userName,
		navItems,
		children
	}: {
		title: string;
		subtitle?: string;
		roleLabel: string;
		userName: string;
		navItems: NavItem[];
		children: Snippet;
	} = $props();

	let collapsed = $state(false);
	let mobileOpen = $state(false);

	let initials = $derived(
		userName
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((n) => n[0]?.toUpperCase() ?? '')
			.join('') || 'HR'
	);
</script>

<div class="flex min-h-screen bg-[#F4F8FF] text-slate-900">
	<!-- Desktop Sidebar (FMS-inspired AppShell) -->
	<aside
		class="hidden flex-col justify-between border-r border-blue-100 bg-white transition-all duration-200 lg:flex {collapsed
			? 'w-20'
			: 'w-64'}"
	>
		<div>
			<!-- Sidebar Brand Header -->
			<div class="flex h-16 items-center justify-between border-b border-blue-100 px-4">
				{#if !collapsed}
					<a href="/" class="flex items-center gap-2.5">
						<img src="/assets/images/logo.png" alt="Harapanku" class="h-8 w-auto" />
					</a>
				{:else}
					<a href="/" class="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-heading text-sm font-bold text-white">
						H
					</a>
				{/if}

				<button
					type="button"
					onclick={() => (collapsed = !collapsed)}
					class="cursor-pointer rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50"
					title={collapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
				>
					<span class="material-symbols-outlined text-[20px]">
						{collapsed ? 'chevron_right' : 'chevron_left'}
					</span>
				</button>
			</div>

			<!-- Navigation Links -->
			<nav class="space-y-1.5 p-3">
				{#each navItems as item}
					{#if item.href}
						<a
							href={item.href}
							class="flex items-center gap-3 rounded-xl px-3 py-2.5 font-subheading text-sm font-semibold transition {item.active
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}"
							title={collapsed ? item.label : undefined}
						>
							<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
							{#if !collapsed}
								<span class="truncate">{item.label}</span>
							{/if}
						</a>
					{:else}
						<button
							type="button"
							onclick={item.onclick}
							class="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left font-subheading text-sm font-semibold transition {item.active
								? 'bg-blue-600 text-white shadow-sm'
								: 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}"
							title={collapsed ? item.label : undefined}
						>
							<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
							{#if !collapsed}
								<span class="truncate">{item.label}</span>
							{/if}
						</button>
					{/if}
				{/each}
			</nav>
		</div>

		<!-- Sidebar Footer Profile -->
		<div class="border-t border-blue-100 p-3">
			<div class="flex items-center gap-3 rounded-xl bg-blue-50/70 p-2.5">
				<div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-heading text-xs font-bold text-white">
					{initials}
				</div>
				{#if !collapsed}
					<div class="min-w-0 flex-1">
						<p class="truncate text-xs font-bold text-slate-900">{userName}</p>
						<p class="truncate text-[11px] font-medium text-blue-700">{roleLabel}</p>
					</div>
				{/if}
			</div>
			<form method="POST" action="/logout" class="mt-2">
				<button
					type="submit"
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
				>
					<span class="material-symbols-outlined text-[16px]">logout</span>
					{#if !collapsed}
						<span>Keluar</span>
					{/if}
				</button>
			</form>
		</div>
	</aside>

	<!-- Mobile Sidebar Drawer -->
	{#if mobileOpen}
		<div class="fixed inset-0 z-50 lg:hidden">
			<button
				type="button"
				aria-label="Tutup Menu"
				onclick={() => (mobileOpen = false)}
				class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
			></button>
			<div class="fixed top-0 left-0 flex h-full w-72 flex-col justify-between bg-white p-4 shadow-2xl">
				<div>
					<div class="flex items-center justify-between border-b border-blue-100 pb-3">
						<img src="/assets/images/logo.png" alt="Harapanku" class="h-8 w-auto" />
						<button
							type="button"
							onclick={() => (mobileOpen = false)}
							class="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50"
						>
							<span class="material-symbols-outlined text-[20px]">close</span>
						</button>
					</div>
					<nav class="mt-4 space-y-1.5">
						{#each navItems as item}
							{#if item.href}
								<a
									href={item.href}
									onclick={() => (mobileOpen = false)}
									class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold {item.active
										? 'bg-blue-600 text-white'
										: 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}"
								>
									<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
									<span>{item.label}</span>
								</a>
							{:else}
								<button
									type="button"
									onclick={() => {
										item.onclick?.();
										mobileOpen = false;
									}}
									class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold {item.active
										? 'bg-blue-600 text-white'
										: 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}"
								>
									<span class="material-symbols-outlined text-[20px]">{item.icon}</span>
									<span>{item.label}</span>
								</button>
							{/if}
						{/each}
					</nav>
				</div>
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-2.5 text-xs font-bold text-blue-700"
					>
						<span class="material-symbols-outlined text-[16px]">logout</span>
						<span>Keluar</span>
					</button>
				</form>
			</div>
		</div>
	{/if}

	<!-- Main Column -->
	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Top Header Bar -->
		<header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-blue-100 bg-white/95 px-4 backdrop-blur sm:px-8">
			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={() => (mobileOpen = true)}
					class="rounded-lg p-2 text-blue-700 hover:bg-blue-50 lg:hidden"
					aria-label="Buka Navigasi"
				>
					<span class="material-symbols-outlined text-[22px]">menu</span>
				</button>
				<div>
					<h1 class="font-heading text-base font-bold text-slate-900 sm:text-lg">{title}</h1>
					{#if subtitle}
						<p class="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-3">
				<span class="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-subheading text-xs font-bold text-blue-700 sm:inline-flex">
					{roleLabel}
				</span>
				<a
					href="/"
					class="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
				>
					<span class="material-symbols-outlined text-[16px]">public</span>
					<span class="hidden sm:inline">Website Utama</span>
				</a>
			</div>
		</header>

		<!-- Content Body -->
		<main class="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">
			{@render children()}
		</main>
	</div>
</div>
