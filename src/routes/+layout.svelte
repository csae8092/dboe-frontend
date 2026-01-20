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
		NavHamburger,
		Hr
	} from 'flowbite-svelte';
	import { UserCircleOutline, UserSettingsOutline } from 'flowbite-svelte-icons';
	import { GithubSolid } from 'flowbite-svelte-icons';
	let { children } = $props();
</script>

<svelte:head>
	<title>{APP_NAME}</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Navbar>
		<NavBrand href={resolve('/')}>
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{APP_NAME}</span>
		</NavBrand>
		<div class="flex items-center md:order-2">
			{#if $user.username && $user.usertoken}
				<button
					id="user-menu"
					type="button"
					tabindex="0"
					aria-label="User menu"
					aria-expanded="false"
					aria-haspopup="true"
					class="flex rounded-full text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
				>
					<UserSettingsOutline class="h-7 w-7 shrink-0" />
				</button>
			{:else}
				<button
					id="user-menu"
					type="button"
					tabindex="0"
					aria-label="User menu"
					aria-expanded="false"
					aria-haspopup="true"
					class="flex rounded-full text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
				>
					<UserCircleOutline class="h-7 w-7 shrink-0" />
				</button>
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
			<NavLi href={resolve('/beleg-rows')}>Belege (neu)</NavLi>
			<NavLi href={resolve('/senses')}>Bedeutungen</NavLi>
		</NavUl>
	</Navbar>

	<main class="flex-1">
		<div class="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 2xl:mx-40">
			{@render children()}
		</div>
	</main>
	<Hr />
	<footer class="mb-3 flex justify-center">
		<a href="https://github.com/csae8092/dboe-frontend">
			<GithubSolid class="h-10 w-10 dark:hover:text-white" />
			<span class="sr-only">Link to code on GitHub</span>
		</a>
	</footer>
</div>
