<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Toaster position="top-right" richColors />
	{@render children()}
	<div class="grow"></div>
	<Footer />
</div>
