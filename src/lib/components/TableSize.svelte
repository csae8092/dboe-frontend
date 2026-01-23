<svelte:options runes={true} />

<script>
	import { Label, Select } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	function handlePageSizeChange(event) {
		const newSize = event.target.value;
		const url = new URL(window.location.href);
		url.searchParams.set('page_size', newSize);
		goto(url.pathname + url.search);
	}
</script>

<div>
	<Label for="page_size">Items per page:</Label>
	<Select id="page_size" onchange={handlePageSizeChange}>
		<option value="10">10</option>
		<option value="20">20</option>
		<option value="40">40</option>
	</Select>
</div>
