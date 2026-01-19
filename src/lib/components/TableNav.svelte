<svelte:options runes={true} />

<script>
	import { P, ButtonGroup, Button, Label, Select } from 'flowbite-svelte';
	import { ChevronDoubleLeftOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { pageSize = $bindable(), data = $bindable(), loading = $bindable(), error = $bindable(), apiBaseUrl } = $props();

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

	function updateURL(pageNum, size) {
		const params = new URLSearchParams();
		params.set('page', pageNum);
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

	function handlePageSizeChange(event) {
		const newSize = event.target.value;
		updateURL('1', newSize);
		fetchData(`${apiBaseUrl}?page=1&page_size=${newSize}`);
	}
</script>

<P class="mb-4">Total count: {data?.count || 0}</P>
<div class="start mt-4 mb-2 flex">
	<ButtonGroup>
		<Button onclick={previousPage} disabled={!data.previous}>
			<ChevronDoubleLeftOutline class="h-6 w-6" />
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
