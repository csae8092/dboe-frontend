<svelte:options runes={true} />

<script>
	import { Heading } from 'flowbite-svelte';
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	let pageTitle = 'Bedeutungen';
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Mybreadcrumb {pageTitle} />
