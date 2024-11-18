<script>
// @ts-nocheck
	import { Label, Input, Helper } from "flowbite-svelte";

let { type, label, name, placeholder = '', value = '', required = false, errors, disabled = false } = $props();
</script>
<div class="mb-6">
    <Label class="mb-2" color={errors ? 'red' : 'gray'}>{label}</Label>
    <Input type={type} name={name} placeholder={placeholder} value={value} {required} color={errors ? 'red' : 'base'} {disabled}/>
    {#if errors}
        {#each errors as error}
            <Helper class='mt-2' color="red">{error}</Helper>
        {/each}
    {/if}
</div>