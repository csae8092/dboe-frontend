<svelte:options runes={true} />

<script>
	import { Modal, Input, Label, Button, Heading } from 'flowbite-svelte';

	let { open = $bindable(), cellData, apiBaseUrl, userToken, onClose, onSuccess, onError } = $props();

	let localValue = $state('');

	$effect(() => {
		localValue = cellData.value;
	});

	async function handleSubmit(event) {
		event.preventDefault();
		const url = `${apiBaseUrl}${cellData.rowId}/`;
		const payload = JSON.stringify({ [cellData.key]: localValue });
		const token = `Token ${userToken}`;

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
				onSuccess(cellData.rowId, cellData.key, updatedData[cellData.key]);
				open = false;
			} else {
				const data = await response.json();
				const errorMessage = data['detail'] || 'Update failed';
				onError(errorMessage);
			}
		} catch (err) {
			onError('Failed to connect to the server');
		}
	}
</script>

<Modal bind:open size="md" autoclose outsideclose>
	{#snippet header()}
		<div class="text-center">
			<Heading tag="h3">Edit <span class="font-light">{cellData.rowId}</span></Heading>
		</div>
	{/snippet}
	<form onsubmit={handleSubmit} id="updateCellForm">
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div class="hidden">
				<Label for="belegId" class="mb-2">{cellData.rowId}</Label>
				<Input id="belegId" type="hidden" value={cellData.rowId} disabled />
			</div>
			<div class="hidden">
				<Label for="belegKey" class="mb-2">{cellData.key}</Label>
				<Input id="belegKey" type="hidden" value={cellData.key} disabled />
			</div>
			<div>
				<Label for="belegValue" class="mb-2">{cellData.key}</Label>
				<Input id="belegValue" type="text" bind:value={localValue} />
			</div>
		</div>
		<Button type="submit">Submit</Button>
	</form>
</Modal>
