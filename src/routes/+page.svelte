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
</Breadcrumb>

<Heading tag="h1">{APP_NAME}</Heading>
