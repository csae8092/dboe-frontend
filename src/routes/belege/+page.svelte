<script lang="ts">
	import { resolve } from '$app/paths';
	import { user } from '$lib/stores';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Heading,
		P,
		Button,
		ButtonGroup,
		Select,
		Label,
		TextPlaceholder,
		Modal,
		Input,
		CloseButton
	} from 'flowbite-svelte';
	import {
		HomeOutline,
		ChevronRightOutline,
		ChevronLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { BELGE_BASE_URL } from '$lib/constants.js';
	import { browser } from '$app/environment';

	let pageTitle = 'Belege';
	let data = $state({ results: [], count: 0, next: null, previous: null });
	let loading = $state(true);
	let error = $state('');
	let modalOpen = $state(false);
	let cellData = $state({ rowId: '', key: '', value: '' });

	let pageSize = $derived(page.url.searchParams.get('page_size') || '10');
	let urlSearch = $derived(page.url.search);

	$effect(() => {
		if (browser && urlSearch !== undefined) {
			const pageNum = page.url.searchParams.get('page') || '1';
			const size = page.url.searchParams.get('page_size') || '10';
			fetchData(`${BELGE_BASE_URL}?page=${pageNum}&page_size=${size}`);
		}
	});

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

	function updateURL(page: string, size: string) {
		const params = new URLSearchParams();
		params.set('page', page);
		params.set('page_size', size);
		goto(`?${params.toString()}`, { replaceState: false, noScroll: true });
	}

	function nextPage() {
		if (data.next) {
			const url = new URL(data.next);
			const nextPageNum = url.searchParams.get('page') || '1';
			updateURL(nextPageNum, pageSize);
			fetchData(data.next);
		}
	}

	function previousPage() {
		if (data.previous) {
			const url = new URL(data.previous);
			const prevPageNum = url.searchParams.get('page') || '1';
			updateURL(prevPageNum, pageSize);
			fetchData(data.previous);
		}
	}

	function handlePageSizeChange(event: Event) {
		const newSize = (event.target as HTMLSelectElement).value;
		updateURL('1', newSize);
		fetchData(`${BELGE_BASE_URL}?page=1&page_size=${newSize}`);
	}

	function handleCellClick(rowId: string | number, key: string, value: any) {
		return () => {
			if (!$user.username || !$user.usertoken) {
				alert('foo');
				return;
			}
			cellData = { rowId: String(rowId), key, value: String(value) };
			modalOpen = true;
		};
	}
</script>

<svelte:head>
	<title>Belege</title>
</svelte:head>

<Breadcrumb aria-label="Breadcrumbs" class="px-5 py-3">
	<BreadcrumbItem href={resolve('/')} home>
		{#snippet icon()}
			<HomeOutline class="h-4 w-4 dark:text-white" />
		{/snippet}Home
	</BreadcrumbItem>
	<BreadcrumbItem>
		{#snippet icon()}
			<ChevronRightOutline class="h-4 w-4 dark:text-white" />
		{/snippet}
		{pageTitle}
	</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h1">{pageTitle}</Heading>

{#if loading}
	<div id="placeholder" class="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col items-center justify-center px-4">
		<Heading tag="h2">Loading...</Heading>
		<TextPlaceholder size="xl"></TextPlaceholder>
	</div>
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
		<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
			<thead class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
				{#if data.results.length > 0}
					<tr>
						{#each Object.keys(data.results[0]).filter((k) => k !== 'url') as key}
							<th class="px-6 py-3">{key}</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each data.results as item}
					<tr
						class="max-h-[4.5rem] border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
					>
						{#each Object.keys(item).filter((k) => k !== 'url') as key}
							{@const cellValue = Array.isArray(item[key])
								? item[key].length > 0
									? item[key].join(' || ')
									: ''
								: item[key] !== null && item[key] !== undefined
									? item[key]
									: ''}
							<td>
								<button
									data-row-id={item.id}
									data-key={key}
									data-value={cellValue}
									class="cursor-pointer"
									onclick={handleCellClick(item.id, key, cellValue)}
									tabindex="0"
								>
									<div class="line-clamp-3">
										{cellValue}
									</div>
								</button>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<Modal bind:open={modalOpen} size="md" autoclose outsideclose>
	{#snippet header()}
		<div class="text-center">
			<Heading tag="h3">Edit <span class="font-light">{cellData.rowId}</span></Heading>
			<Heading tag="h4">Change value of <span class="font-light">{cellData.key}</span></Heading>
		</div>
	{/snippet}
	<div class="space-y-4">
		<div>
			<Label class="mb-2">ID</Label>
			<Input type="text" value={cellData.rowId} disabled />
		</div>
		<div>
			<Label for="cellKey" class="mb-2">Field</Label>
			<Input id="cellKey" type="text" value={cellData.key} disabled />
		</div>
		<div>
			<Label for="cellValue" class="mb-2">{cellData.key}</Label>
			<Input id="cellValue" type="text" bind:value={cellData.value} />
		</div>
	</div>
	{#snippet footer()}
		<Button onclick={() => (modalOpen = false)}>Cancel</Button>
		<Button
			color="blue"
			onclick={() => {
				// Handle save logic here
				console.log('Saving:', cellData);
				modalOpen = false;
			}}>Save</Button
		>
	{/snippet}
</Modal>
