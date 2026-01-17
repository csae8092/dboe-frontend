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
		TableHeadCell,
		Button,
		ButtonGroup,
		Select,
		Label
	} from 'flowbite-svelte';
	import {
		HomeOutline,
		ChevronRightOutline,
		ChevronLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	let pageTitle = 'Belege';
	let data = { results: [], count: 0, next: null, previous: null };
	let loading = true;
	let error = '';
	let pageSize = '10';

	async function fetchData(url: string) {
		loading = true;
		error = '';
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch data');
			data = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchData(`https://dboe-backend.acdh-dev.oeaw.ac.at/api/belege-elastic-search/?page_size=${pageSize}`);
	});

	function nextPage() {
		if (data.next) fetchData(data.next);
	}

	function previousPage() {
		if (data.previous) fetchData(data.previous);
	}

	function handlePageSizeChange() {
		fetchData(`https://dboe-backend.acdh-dev.oeaw.ac.at/api/belege-elastic-search/?page_size=${pageSize}`);
	}
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
	<div class="start mt-4 mb-2 flex">
		<ButtonGroup>
			<Button onclick={previousPage} disabled={!data.previous}>
				<ChevronLeftOutline class="h-6 w-6" />
				Previous
			</Button>
			<Button onclick={nextPage} disabled={!data.next}>
				Next
				<ChevronDoubleRightOutline class="h-6 w-6" />
			</Button>
		</ButtonGroup>
	</div>
	<div class="mt-4 mb-4 flex items-center gap-2">
		<Label for="pageSize">Items per page:</Label>
		<Select id="pageSize" bind:value={pageSize} onchange={handlePageSizeChange} class="w-24">
			<option value="10">10</option>
			<option value="20">20</option>
			<option value="40">40</option>
		</Select>
	</div>
	<div class="overflow-x-auto rounded-lg border shadow">
		<Table>
			<TableHead>
				{#if data.results.length > 0}
					{#each Object.keys(data.results[0]).filter((k) => k !== 'url') as key}
						<TableHeadCell>{key}</TableHeadCell>
					{/each}
				{/if}
			</TableHead>
			<TableBody>
				{#each data.results as item}
					<TableBodyRow>
						{#each Object.keys(item).filter((k) => k !== 'url') as key}
							<TableBodyCell>
								{#if Array.isArray(item[key])}
									{item[key].length > 0 ? item[key].join(' || ') : ''}
								{:else}
									{item[key] !== null && item[key] !== undefined ? item[key] : ''}
								{/if}
							</TableBodyCell>
						{/each}
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}
