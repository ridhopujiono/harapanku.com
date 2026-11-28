import type { NavItem } from './DashboardShell.svelte';

export function getAdminNavItems(currentPath: string): NavItem[] {
	return [
		{
			label: 'Antrean Reservasi',
			icon: 'inbox',
			href: '/admin',
			active: currentPath === '/admin'
		},
		{
			dividerLabel: 'CMS',
			label: 'Hero & Footer',
			icon: 'web',
			href: '/admin/cms/hero',
			active: currentPath === '/admin/cms/hero'
		},
		{
			label: 'Section Konten',
			icon: 'view_agenda',
			href: '/admin/cms/sections',
			active: currentPath === '/admin/cms/sections'
		},
		{
			label: 'Layanan Kami',
			icon: 'medical_services',
			href: '/admin/cms/services',
			active: currentPath === '/admin/cms/services'
		},
		{
			label: 'Paket & Investasi',
			icon: 'payments',
			href: '/admin/cms/packages',
			active: currentPath === '/admin/cms/packages'
		}
	];
}
