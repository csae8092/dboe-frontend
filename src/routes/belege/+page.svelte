<svelte:options runes={true} />

<script>
	import { ROUTE_MAPPER } from '$lib/constants';
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';
	import EditRowModal from '$lib/components/EditRowModal.svelte';
	import { Heading, P, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { BELGE_BASE_URL } from '$lib/constants';
	import { usePagination } from '$lib/usePagination.svelte';
	import { EditOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { user } from '$lib/stores';

	const ignoreFields = ['url', 'id', 'beleg', 'orig_xml'];
	let pageTitle = 'Belege';
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
	<div class="data-table-container">
		<table class="data-table">
			<thead class="data-table-header">
				{#if pagination.data.results.length > 0}
					<tr>
						<th class="data-table-header-cell">Edit</th>
						{#each Object.keys(pagination.data.results[0]) as key}
							<th class="data-table-header-cell">{key}</th>
						{/each}
					</tr>
				{/if}
			</thead>
			<tbody>
				{#each pagination.data.results as item}
					<tr class="data-table-row">
						<td class="data-table-cell">
							<Button>
								Edit <ChevronDownOutline></ChevronDownOutline>
								<Dropdown simple>
									<DropdownItem>
										<Button onclick={() => openEditRowModal(item)}>
											<EditOutline class="h-4 w-4 shrink-0" /><span class="sr-only">edit {item.id}</span>
										</Button>
									</DropdownItem>
									<DropdownDivider />
									{#each Object.keys(ROUTE_MAPPER) as x}
										<DropdownItem>
											<a href="/belege/{x}/{item.id}">{x}</a>
										</DropdownItem>
									{/each}
								</Dropdown>
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
							<td class="data-table-cell">
								<div class="line-clamp-3">
									{#if key === 'url'}
										<a href={`${item[key]}?format=json`}>{item.id}</a>
									{:else}
										{cellValue}
									{/if}
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
