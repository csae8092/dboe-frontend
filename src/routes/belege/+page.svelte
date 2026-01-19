<script>
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
		Toast,
		ToastContainer
	} from 'flowbite-svelte';
	import EditCellModal from '$lib/components/EditCellModal.svelte';
	import TableLoad from '$lib/components/TableLoad.svelte';
	import TableNav from '$lib/components/TableNav.svelte';
	import { HomeOutline, CheckCircleSolid, CloseCircleSolid, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { BELGE_BASE_URL } from '$lib/constants.js';
	import { colKeys, belegKeyMapping } from '$lib/belegkeys';
	import { browser } from '$app/environment';
	import Mybreadcrumb from '$lib/components/Mybreadcrumb.svelte';

	let pageTitle = 'Belege';

	let data = $state({ results: [], count: 0, next: null, previous: null });
	let loading = $state(true);
	let error = $state('');
	let modalOpen = $state(false);
	let cellData = $state({ rowId: '', key: '', value: '' });
	let highlightedRowId = $state(null);

	let toasts = $state([]);
	let nextId = $state(1);

	function addToast(color, message) {
		const newToast = {
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

	function dismissToast(id) {
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

	function handleClose(id) {
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
			fetchData(`${BELGE_BASE_URL}?page=${pageNum}&page_size=${size}`);
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

	function handleCellClick(rowId, key, value) {
		cellData = { rowId: String(rowId), key, value: String(value) };
		modalOpen = true;
	}

	function handleModalSuccess(rowId, key, updatedValue) {
		data.results = data.results.map((item) => {
			if (String(item.id) === rowId) {
				return { ...item, [key]: updatedValue };
			}
			return item;
		});
		addToast('green', `Beleg: ${rowId} updated successfully!`);
		highlightedRowId = rowId;
		setTimeout(() => {
			highlightedRowId = null;
		}, 2000);
	}

	function handleModalError(message) {
		addToast('red', message);
	}

	function handleModalClose() {
		modalOpen = false;
	}
</script>

<svelte:head>
	<title>Belege</title>
</svelte:head>

<Mybreadcrumb {pageTitle}></Mybreadcrumb>

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
						{#each Object.keys(data.results[0]).filter((k) => colKeys.includes(k)) as key}
							<th class="px-6 py-3">{belegKeyMapping[key]['label']}</th>
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
						{#each Object.keys(item).filter((k) => colKeys.includes(k)) as key}
							{@const cellValue = Array.isArray(item[key])
								? item[key].length > 0
									? item[key].join(' || ')
									: ''
								: item[key] !== null && item[key] !== undefined
									? item[key]
									: ''}
							<td class="px-3 py-2">
								{#if $user.username && $user.usertoken && belegKeyMapping[key]?.modify}
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

<EditCellModal
	bind:open={modalOpen}
	{cellData}
	apiBaseUrl={BELGE_BASE_URL}
	userToken={$user.usertoken}
	onClose={handleModalClose}
	onSuccess={handleModalSuccess}
	onError={handleModalError}
/>

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
