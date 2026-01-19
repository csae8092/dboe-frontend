<svelte:options runes={true} />

<script>
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { HomeOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { pageTitle } = $props();
	let pageUrl = $derived(page.url.pathname);
</script>

<Breadcrumb aria-label="Breadcrumbs" class="px-5 py-3">
	<BreadcrumbItem href={resolve('/')} home>
		{#snippet icon()}
			<HomeOutline class="h-4 w-4" />
		{/snippet}Home
	</BreadcrumbItem>
	{#if pageUrl && pageUrl !== '/'}
		<BreadcrumbItem href={resolve(pageUrl)}>
			{#snippet icon()}
				<ChevronRightOutline class="h-4 w-4 dark:text-white" />
			{/snippet}
			{pageTitle}
		</BreadcrumbItem>
	{/if}
</Breadcrumb>
