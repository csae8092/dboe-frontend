<svelte:options runes={true} />

<script>
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';
	import EditRowModal from '$lib/components/EditRowModal.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
	import { BELGE_BASE_URL } from '$lib/constants';
	import { usePagination } from '$lib/usePagination.svelte';
	import { EditOutline } from 'flowbite-svelte-icons';
	import { user } from '$lib/stores';
	const ignoreFields = ['url', 'id', 'beleg', 'orig_xml'];

	let pageTitle = 'Belege (neu)';
	const pagination = usePagination(BELGE_BASE_URL);
	let modalOpen = $state(false);
	let selectedItem = $state(null);
	const openEditRowModal = (item) => {
		selectedItem = item;
		modalOpen = true;
	};
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
						<th class="px-6 py-3">Edit</th>
						{#each Object.keys(pagination.data.results[0]) as key}
							<th class="px-6 py-3">{key}</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each pagination.data.results as item}
					<tr class="max-h-18 border-b transition-colors duration-500">
						<td class="px-3 py-2">
							<Button onclick={() => openEditRowModal(item)}>
								<EditOutline class="h-6 w-6 shrink-0" /><span class="sr-only">edit {item.id}</span>
							</Button>
						</td>
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

<EditRowModal bind:open={modalOpen} rowData={selectedItem} userToken={$user.usertoken} {ignoreFields}>
	{user}</EditRowModal
>
