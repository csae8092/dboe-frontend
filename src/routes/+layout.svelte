<script>
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { APP_NAME } from '$lib/constants';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, P } from 'flowbite-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar>
	<NavBrand href={resolve('/')}>
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{APP_NAME}</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href={resolve('/')}>Home</NavLi>
		<NavLi href={resolve('/about')}>About</NavLi>
		<NavLi href={resolve('/belege')}>Belege</NavLi>
	</NavUl>
</Navbar>

<main>
	<div class="container mx-auto">
		{@render children()}
	</div>
</main>
