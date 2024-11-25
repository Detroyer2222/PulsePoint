<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { OrganizationMember } from '$lib/pulepointTypes';
	import { Input, Button } from 'flowbite-svelte';
	import { toast } from 'svelte-sonner';

	let data: OrganizationMember[] = $props();
</script>

<div class="relative overflow-x-auto">
	<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
		<thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-3"> Username </th>
				<th scope="col" class="px-6 py-3">
					<span class="sr-only">Remove</span>
				</th>
			</tr>
		</thead>
		<tbody>
			{#each data as member}
				<tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
					<th
						scope="row"
						class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
					>
						{member.username}
					</th>
				</tr>
				<tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
					<th
						scope="row"
						class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
					>
						<form
							method="post"
							action="?/removeMember"
							use:enhance={() => {
								return async ({ result, update }) => {
									if (result.type === 'success') {
										toast.success('Member removed successfully');
										await update();
									} else {
										await applyAction(result);
									}
								};
							}}
							class="flex flex-row justify-end"
						>
							<Input type="hidden" name="userId" value={member.id} />
							<Button type="submit" class="">Remove</Button>
						</form>
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
