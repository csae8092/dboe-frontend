<svelte:options runes={true} />

<script>
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	import { Heading } from 'flowbite-svelte';
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	import { SENSE_BASE_URL } from '$lib/constants.js';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';
	let pageTitle = 'Bedeutungen';
	let data = $state({ results: [], count: 0, next: null, previous: null });
	let loading = $state(true);
	let error = $state('');
	let modalOpen = $state(false);
	let cellData = $state({ rowId: '', key: '', value: '' });
	let pageSize = $state('10');
	let urlSearch = $derived(page.url.search);

	$effect(() => {
		if (browser && urlSearch !== undefined) {
			pageSize = page.url.searchParams.get('page_size') || '10';
		}
	});

	$effect(() => {
		if (browser && urlSearch !== undefined) {
			const pageNum = page.url.searchParams.get('page') || '1';
			const size = page.url.searchParams.get('page_size') || '10';
			fetchData(`${SENSE_BASE_URL}?page=${pageNum}&page_size=${size}`);
		}
	});

	async function fetchData(url) {
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
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Mybreadcrumb {pageTitle} />
<Heading tag="h1">{pageTitle}</Heading>
{#if loading}
	<TableLoad></TableLoad>
{:else if error}
	<P class="text-red-600">Error: {error}</P>
{:else}
	<TableNav bind:pageSize bind:data bind:loading bind:error />
	<div class="overflow-x-auto rounded-lg border shadow">
		<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
			<thead class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
				{#if data.results.length > 0}
					<tr>
						{#each Object.keys(data.results[0]) as key}
							<th class="px-6 py-3">{key}</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each data.results as item}
					<tr class="max-h-18 border-b transition-colors duration-500">
						{#each Object.keys(item) as key}
							{@const cellValue = Array.isArray(item[key])
								? item[key].length > 0
									? item[key].join(' || ')
									: ''
								: item[key] !== null && item[key] !== undefined
									? item[key]
									: ''}
							<td class="px-3 py-2">
								<div class="line-clamp-3">
									{cellValue}
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
