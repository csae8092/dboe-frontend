<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { APP_NAME } from '$lib/constants';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, P } from 'flowbite-svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar>
	<NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
			>{APP_NAME}</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
	</NavUl>
</Navbar>

<main>
	<div class="lg:container lg:mx-auto">
		{@render children()}
	</div>
</main>
