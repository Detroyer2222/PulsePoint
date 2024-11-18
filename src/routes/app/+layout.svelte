<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import {
		Navbar,
		NavBrand,
		Avatar,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { getImageUrlFromPocketBase, toggleTheme } from '$lib/utils';

	let { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();

	let avatarUrl = $state(data.user?.avatar);
	let isDarkMode = $state(true);
	
	function toggleDarkMode() {
        isDarkMode = !isDarkMode;
		toggleTheme(isDarkMode);
    }
</script>

<Navbar>
	<NavBrand href="dashboard">
		<img src="/favicon.png" class="me-3 h-6 sm:h-9" alt="PulsePoint Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Pulsepoint</span
		>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<Avatar src={avatarUrl 
			? getImageUrlFromPocketBase(data.user?.collectionId ?? '', data.user?.id ?? '', data.user?.avatar, "36x36") 
			: "" } id="avatar-menu" class="cursor-pointer" />
		<NavHamburger />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">{data.user?.username}</span>
			<span class="block truncate text-sm font-medium">{data.user?.email}</span>
		</DropdownHeader>
		<DropdownItem href="/app/settings/organization">Organization Settings</DropdownItem>
		<DropdownItem href="/app/settings/profile">Profile Settings</DropdownItem>
		<DropdownDivider />
		<DropdownItem onclick={toggleDarkMode}>
			{#if isDarkMode}
				  Light Mode
			{:else}
				  Dark Mode
			{/if}
		</DropdownItem>
		<DropdownDivider />
		<DropdownItem href="/logout">Sign out</DropdownItem>
	</Dropdown>
	<NavUl>
		<NavLi href="/app/dashboard">Dashboard</NavLi>
		<NavLi href="/app/jobs">Open Jobs</NavLi>
		<NavLi href="/app/organization">Organization</NavLi>
	</NavUl>
</Navbar>

{@render children()}
