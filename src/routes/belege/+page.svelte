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
		Toast,
		ToastContainer
	} from 'flowbite-svelte';
	import {
		HomeOutline,
		ChevronRightOutline,
		ChevronLeftOutline,
		ChevronDoubleRightOutline,
		CheckCircleSolid,
		CloseCircleSolid
	} from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { BELGE_BASE_URL } from '$lib/constants.js';
	import { browser } from '$app/environment';

	let pageTitle = 'Belege';

	let data = $state({ results: [], count: 0, next: null, previous: null });
	let loading = $state(true);
	let error = $state('');
	let updateError = $state('');
	let modalOpen = $state(false);
	let cellData = $state({ rowId: '', key: '', value: '' });
	let highlightedRowId = $state<string | null>(null);

	type ToastColor = 'green' | 'red';

	interface ToastItem {
		id: number;
		message: string;
		color: ToastColor;
		timeoutId?: ReturnType<typeof setTimeout>;
		visible: boolean;
	}

	let toasts = $state<ToastItem[]>([]);
	let nextId = $state(1);

	function addToast(color: ToastColor, message: string) {
		const newToast: ToastItem = {
			id: nextId,
			message,
			color,
			visible: true
		};

		// Auto-dismiss after 5 seconds
		const timeoutId = setTimeout(() => {
			dismissToast(newToast.id);
		}, 5000);
		newToast.timeoutId = timeoutId;

		toasts = [...toasts, newToast];
		nextId++;
	}

	function dismissToast(id: number) {
		// Clear timeout if it exists
		const toast = toasts.find((t) => t.id === id);
		if (toast?.timeoutId) {
			clearTimeout(toast.timeoutId);
		}

		// Set visible to false to trigger outro transition
		toasts = toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));

		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 300); // Slightly longer than transition duration
	}

	function handleClose(id: number) {
		return () => {
			dismissToast(id);
		};
	}

	onDestroy(() => {
		// Clear all pending timeouts on unmount
		toasts.forEach((toast) => {
			if (toast.timeoutId) {
				clearTimeout(toast.timeoutId);
			}
		});
	});

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
		cellData = { rowId: String(rowId), key, value: String(value) };
		modalOpen = true;
	}

	async function updateCell(event: Event) {
		event.preventDefault();
		let url: string = `${BELGE_BASE_URL}${cellData.rowId}/`;
		let payload: string = `{"${cellData.key}": "${cellData.value}"}`;
		let token: string = `Token ${$user.usertoken}`;
		try {
			const response = await fetch(url, {
				method: 'PATCH',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: token
				},
				body: payload
			});

			if (response.ok) {
				const updatedData = await response.json();
				data.results = data.results.map((item) => {
					if (String(item.id) === cellData.rowId) {
						return { ...item, [cellData.key]: updatedData[cellData.key] };
					}
					return item;
				});
				addToast('green', `Beleg: ${cellData.rowId} updated successfully!`);
				modalOpen = false;

				// Highlight the updated row
				highlightedRowId = cellData.rowId;
				setTimeout(() => {
					highlightedRowId = null;
				}, 2000);
			} else {
				const data = await response.json();
				updateError = data['detail'] || 'Update failed';
				addToast('red', updateError);
			}
		} catch (err) {
			updateError = 'Failed to connect to the server';
			addToast('red', updateError);
		} finally {
		}
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
					{@const isHighlighted = String(item.id) === highlightedRowId}
					<tr
						class="max-h-18 border-b transition-colors duration-500 {isHighlighted
							? 'bg-green-200 dark:bg-green-800'
							: 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600'} dark:border-gray-700"
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
								{#if $user.username || $user.usertoken}
									<button
										data-row-id={item.id}
										data-key={key}
										data-value={cellValue}
										class="cursor-pointer"
										onclick={() => handleCellClick(item.id, key, cellValue)}
										tabindex="0"
									>
										<div class="line-clamp-3">
											{cellValue}
										</div>
									</button>
								{:else}
									<div class="line-clamp-3">
										{cellValue}
									</div>
								{/if}
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
		</div>
	{/snippet}
	<form onsubmit={updateCell} id="updateCellForm">
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div class="hidden">
				<Label for="belegId" class="mb-2">{cellData.rowId}</Label>
				<Input id="belegId" type="hidden" bind:value={cellData.rowId} disabled />
			</div>
			<div class="hidden">
				<Label for="belegKey" class="mb-2">{cellData.key}</Label>
				<Input id="belegKey" type="hidden" bind:value={cellData.key} disabled />
			</div>
			<div>
				<Label for="belegValue" class="mb-2">{cellData.key}</Label>
				<Input id="belegValue" type="text" bind:value={cellData.value} />
			</div>
		</div>

		<Button type="submit">Submit</Button>
	</form>
</Modal>

<ToastContainer position="bottom-right">
	{#each toasts as toast (toast.id)}
		<Toast
			color={toast.color}
			dismissable={true}
			transition={fly}
			params={{ x: 200, duration: 800 }}
			class="w-64"
			onclose={handleClose(toast.id)}
			bind:toastStatus={toast.visible}
		>
			{#snippet icon()}
				{#if toast.color === 'green'}
					<CheckCircleSolid class="h-5 w-5" />
				{:else}
					<CloseCircleSolid class="h-5 w-5" />
				{/if}
			{/snippet}
			{toast.message}
		</Toast>
	{/each}
</ToastContainer>
