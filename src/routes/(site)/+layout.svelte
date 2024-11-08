<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Input, DarkMode } from 'flowbite-svelte';
    import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
    
    let { children, data }: { children:Snippet<[]>, data:LayoutData } = $props();
</script>

<Navbar>
    <NavBrand href="/home">
      <img src="/favicon.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
    </NavBrand>
    <div class="flex md:order-2">
      <Button size="sm" onclick={() => goto("/register")}>Sign Up</Button>
      <NavHamburger />
    </div>
    <NavUl class="order-1">
      <NavLi href="/home">Home</NavLi>
      <NavLi href="/about">About</NavLi>
      <NavLi href="/features">Features</NavLi>
      <NavLi href="/contact">Contact</NavLi>
      <NavLi href="/login">Login</NavLi>
    </NavUl>
</Navbar>

  {@render children()}

