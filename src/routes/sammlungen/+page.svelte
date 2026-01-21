<svelte:options runes={true} />

<script>
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';
	import { Badge, Heading, tags } from 'flowbite-svelte';
	let pageTitle = 'Sammlungen';
	const COLLECTION_BASE_URL = 'http://127.0.0.1:8000/api/collections/';
	import { usePagination } from '$lib/usePagination.svelte';
	const pagination = usePagination(COLLECTION_BASE_URL);
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
{/if}

{#if pagination.data.results.length > 0}
	<div class="data-table-container">
		<table class="data-table">
			<thead class="data-table-header">
				<tr>
					<th class="data-table-header-cell">DBOE-ID</th>
					<th class="data-table-header-cell">Titel</th>
					<th class="data-table-header-cell"># Belege</th>
					<th class="data-table-header-cell">Tags</th>
				</tr>
			</thead>
			<tbody>
				{#each pagination.data.results as item}
					<tr class="data-table-row">
						<td class="data-table-cell">
							<a
								class="text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
								href={`/belege?collection=${item['id']}`}>{item['id']}</a
							>
						</td>
						<td class="data-table-cell">{item['title']}</td>
						<td class="data-table-cell">{item['beleg_count']}</td>
						<td class="data-table-cell">
							{#each item['tags'] as tag}
								<Badge>{tag.name}</Badge>
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
