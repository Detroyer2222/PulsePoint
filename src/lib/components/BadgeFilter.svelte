<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	let { selectedFilters = $bindable(), filters }: { selectedFilters: string[]; filters: string[] } =
		$props();

	function filterClicked(filter: string) {
		if (selectedFilters.includes(filter)) {
			selectedFilters.splice(selectedFilters.indexOf(filter), 1);
		} else {
			selectedFilters.push(filter);
		}
	}
</script>

{#each filters as filter, i}
	<Badge
		large
		onclick={() => filterClicked(filter)}
		color="red"
		border={!selectedFilters.includes(filter)}
		class={`cursor-pointer hover:bg-red-200`}
	>
		{filter}
	</Badge>
{/each}
