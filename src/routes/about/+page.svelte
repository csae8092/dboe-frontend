<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import { HomeOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
</script>

<Breadcrumb aria-label="Breadcrumbs" class="px-5 py-3">
	<BreadcrumbItem href="/" home>
		{#snippet icon()}
			<HomeOutline class="me-2 h-4 w-4" />
		{/snippet}Home
	</BreadcrumbItem>
	<BreadcrumbItem href="/about">
		{#snippet icon()}
			<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
		{/snippet}
		About
	</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h1">About {APP_NAME}</Heading>
