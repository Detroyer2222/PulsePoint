<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { Sidebar, SidebarWrapper, SidebarGroup, SidebarItem, Hr, Heading } from 'flowbite-svelte';
	import {
		EditOutline,
		UserSettingsSolid,
		LockSolid,
		ChartMixedOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	let pathname = $state($page.url.pathname);

	let activeUrl = $derived($page.url.pathname.split('/').at(-1));

	let { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();
	$inspect(pathname, activeUrl, data.user);
</script>

<div class="flex h-full w-full px-2">
	<Heading tag="h3" class="text-center">Settings</Heading>
</div>
<Hr />

<!-- Main container for Sidebar and Content -->
<div class="flex h-full w-full flex-row">
	<!-- Sidebar -->
	<Sidebar {activeUrl} class="w-64">
		<SidebarWrapper>
			<SidebarGroup>
				<SidebarItem label="Organization" href="organization">
					<svelte:fragment slot="icon">
						<ChartMixedOutline
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarItem label="Profile" href="profile">
					<svelte:fragment slot="icon">
						<UserSettingsSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Security" href="security">
					<svelte:fragment slot="icon">
						<LockSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Content Area -->
	<div class="mx-auto w-full flex-1 px-4">
		{@render children()}
	</div>
</div>
