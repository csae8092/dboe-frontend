<svelte:options runes={true} />

<script>
	import { P, ButtonGroup, Button, Label, Select } from 'flowbite-svelte';
	import { ChevronDoubleLeftOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';

	let { pageSize = $bindable(), previousPage, nextPage, handlePageSizeChange, data } = $props();
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
