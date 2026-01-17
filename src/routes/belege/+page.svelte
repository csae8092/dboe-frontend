<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Heading,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { HomeOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let pageTitle = 'Belege';
	let data = { results: [], count: 0 };
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch('https://dboe-backend.acdh-dev.oeaw.ac.at/api/belege-elastic-search/');
			if (!response.ok) throw new Error('Failed to fetch data');
			data = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Belege</title>
</svelte:head>

<Breadcrumb aria-label="Breadcrumbs" class="px-5 py-3">
	<BreadcrumbItem href="/" home>
		{#snippet icon()}
			<HomeOutline class="h-4 w-4 dark:text-white" />
		{/snippet}Home
	</BreadcrumbItem>
	<BreadcrumbItem href="/about">
		{#snippet icon()}
			<ChevronRightOutline class="h-4 w-4 dark:text-white" />
		{/snippet}
		{pageTitle}
	</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h1">{pageTitle}</Heading>

{#if loading}
	<P>Loading...</P>
{:else if error}
	<P class="text-red-600">Error: {error}</P>
{:else}
	<P class="mb-4">Total count: {data.count}</P>
	<Table>
		<TableHead>
			<TableHeadCell>ID</TableHeadCell>
			<TableHeadCell>HL</TableHeadCell>
			<TableHeadCell>QU</TableHeadCell>
			<TableHeadCell>POS</TableHeadCell>
			<TableHeadCell>Page</TableHeadCell>
			<TableHeadCell>Archivzeile</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each data.results as item}
				<TableBodyRow>
					<TableBodyCell>{item.id}</TableBodyCell>
					<TableBodyCell>{item.hl || ''}</TableBodyCell>
					<TableBodyCell>{item.qu || ''}</TableBodyCell>
					<TableBodyCell>{item.pos || ''}</TableBodyCell>
					<TableBodyCell>{item.page || ''}</TableBodyCell>
					<TableBodyCell>{item.archivzeile || ''}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
