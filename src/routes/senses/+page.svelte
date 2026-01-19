<svelte:options runes={true} />

<script>
	import { Heading, P } from 'flowbite-svelte';
	import { SENSE_BASE_URL } from '$lib/constants.js';
	import { usePagination } from '$lib/usePagination.svelte.js';

	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';

	const pageTitle = 'Bedeutungen';
	const pagination = usePagination(SENSE_BASE_URL);
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Mybreadcrumb {pageTitle} />
<Heading tag="h1">{pageTitle}</Heading>
{#if pagination.loading}
	<TableLoad></TableLoad>
{:else if pagination.error}
	<P class="text-red-600">Error: {pagination.error}</P>
{:else}
	<TableNav
		bind:pageSize={pagination.pageSize}
		bind:data={pagination.data}
		bind:loading={pagination.loading}
		bind:error={pagination.error}
	/>
	<div class="overflow-x-auto rounded-lg border shadow">
		<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
			<thead class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
				{#if pagination.data.results.length > 0}
					<tr>
						{#each Object.keys(pagination.data.results[0]) as key}
							<th class="px-6 py-3">{key}</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each pagination.data.results as item}
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
