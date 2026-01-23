<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	import { Button, Dropdown, DropdownItem, DropdownDivider, Hr, P, Heading } from 'flowbite-svelte';
	import { ChevronDownOutline, EditOutline } from 'flowbite-svelte-icons';

	import NewTableNav from '$lib/components/NewTableNav.svelte';
	import TableSize from '$lib/components/TableSize.svelte';
	import EditRowModal from '$lib/components/EditRowModal.svelte';
	import { ROUTE_MAPPER } from '$lib/constants';
	import { user } from '$lib/stores';

	let { data } = $props();
	let loading = $state(false);
	let modifiedBeleg = $derived($page.url.hash ? $page.url.hash.slice(1) : null);
	const ignoreFields = ['url', 'id', 'beleg', 'orig_xml'];
	let modalOpen = $state(false);
	let selectedItem = $state(null);

	// Make table data reactive by copying from load result
	let tableData = $state([]);
	$effect(() => {
		tableData = data.payload.results ? [...data.payload.results] : [];
	});

	const openEditRowModal = (item) => {
		selectedItem = item;
		modalOpen = true;
	};

	function handleRowUpdated(event) {
		const updatedRow = event.detail.updatedRow;
		const idx = tableData.findIndex((r) => r.id === updatedRow.id);
		if (idx !== -1) {
			tableData[idx] = { ...updatedRow };
		}
	}

	beforeNavigate(() => {
		loading = true;
	});
	afterNavigate(() => {
		loading = false;
	});
</script>

<Heading tag="h1" class="pt-3 pb-2 text-center">{data.page_title}</Heading>
<div class="text-center">
	<NewTableNav {data} {loading}></NewTableNav>
	<P class="text-center">{data.payload.count}</P>
	<TableSize></TableSize>
</div>
<Hr />

<div class="data-table-container">
	<table class="data-table">
		<thead class="data-table-header">
			{#if tableData.length > 0}
				<tr>
					<th class="data-table-header-cell">Edit</th>
					{#each Object.keys(tableData[0]) as key}
						<th class="data-table-header-cell">{key}</th>
					{/each}
				</tr>
			{/if}
		</thead>
		<tbody>
			{#each tableData as item}
				<tr
					class="data-table-row {modifiedBeleg === item.id ? 'bg-green-200 transition-colors duration-500' : ''}"
					id={item.id}
				>
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
<EditRowModal
	bind:open={modalOpen}
	rowData={selectedItem}
	userToken={$user.usertoken}
	{ignoreFields}
	on:rowUpdated={handleRowUpdated}
></EditRowModal>
