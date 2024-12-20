<script>
	// @ts-nocheck
	import { Label, Input, Helper } from 'flowbite-svelte';

	const {
		type,
		label,
		name,
		placeholder = '',
		value = '',
		required = false,
		errors,
		disabled = false
	} = $props();
</script>

<div class="flex flex-col space-y-2">
	<Label color={errors ? 'red' : 'gray'}>{label}</Label>
	<Input
		{type}
		{name}
		{placeholder}
		{value}
		{required}
		color={errors ? 'red' : 'base'}
		{disabled}
	/>
	{#if errors}
		{#each errors as error}
			<Helper color="red">{error}</Helper>
		{/each}
	{/if}
</div>
