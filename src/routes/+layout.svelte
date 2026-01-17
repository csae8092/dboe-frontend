<script>
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { APP_NAME } from '$lib/constants';
	import { user } from '$lib/stores';
	import {
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownGroup,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger
	} from 'flowbite-svelte';
	import { UserCircleOutline, UserSettingsOutline } from 'flowbite-svelte-icons';

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
	<div class="flex items-center md:order-2">
		{#if $user.username && $user.usertoken}
			<UserSettingsOutline class="h-7 w-7 shrink-0" id="user-menu" />
		{:else}
			<UserCircleOutline id="user-menu" />
		{/if}
	</div>
	{#if $user.username && $user.usertoken}
		<Dropdown placement="bottom" triggeredBy="#user-menu">
			<DropdownHeader>
				<span class="block text-sm">{$user.username}</span>
			</DropdownHeader>
			<DropdownHeader onclick={() => user.logout()}>Sign out</DropdownHeader>
		</Dropdown>
	{:else}
		<Dropdown placement="bottom" triggeredBy="#user-menu">
			<DropdownHeader>
				<span class="block text-sm"><a href={resolve('/log-in')}>Log In</a></span>
			</DropdownHeader>
		</Dropdown>
	{/if}
	<NavHamburger />
	<NavUl>
		<NavLi href={resolve('/')}>Home</NavLi>
		<NavLi href={resolve('/about')}>About</NavLi>
		<NavLi href={resolve('/belege')}>Belege</NavLi>
	</NavUl>
</Navbar>

<main>
	<div class="container">
		{@render children()}
	</div>
</main>
