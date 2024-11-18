<script>
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer>
	<div class="sm:flex sm:items-center sm:justify-between mx-4 my-4">
		<FooterCopyright href="/home" by="PulsePoint" year={2025} />
		<FooterLinkGroup
			ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
		>
			<FooterLink href="/about">About</FooterLink>
			<FooterLink href="/privacy">Privacy Policy</FooterLink>
			<FooterLink href="/contact">Contact</FooterLink>
		</FooterLinkGroup>
	</div>
</Footer>
