<svelte:options runes={true} />

<script>
	import { Modal, Input, Label, Button, Heading } from 'flowbite-svelte';
	let { open = $bindable(false), rowData, ignoreFields, userToken } = $props();

	// Create editable copy to preserve original data
	let editableData = $state({});

	$effect(() => {
		if (rowData && open) {
			editableData = JSON.parse(JSON.stringify(rowData));
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();
		let url = editableData.url;
		let filteredData = Object.keys(editableData)
			.filter((key) => !ignoreFields.includes(key) && editableData[key] !== null)
			.reduce((obj, key) => {
				obj[key] = editableData[key];
				return obj;
			}, {});
		let payload = JSON.stringify(filteredData);
		let token = `Token ${userToken}`;
		console.log(url, payload, userToken);
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
				const data = await response.json();
				console.log(data);
				// Update original rowData with successful changes
				Object.assign(rowData, editableData);
				open = false;
			} else {
				const data = await response.json();
				const errorMessage = data['detail'] || 'Update failed';
				alert(errorMessage);
				open = true;
			}
		} catch (err) {
			alert(err);
			open = true;
		}
	}
</script>

<Modal form bind:open>
	{#if rowData}
		<div class="text-center">
			<Heading tag="h3">Edit <span class="font-light">{rowData.id}</span></Heading>
		</div>
		<div class="space-y-4">
			<form onsubmit={handleSubmit} id="updateCellForm">
				<div class="mb-6 grid gap-6 md:grid-cols-2">
					{#each Object.keys(editableData) as key}
						{#if !ignoreFields.includes(key)}
							<div>
								<Label for={key}>{key}</Label>
								<Input type="text" id={key} bind:value={editableData[key]} />
							</div>
						{/if}
					{/each}
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	{/if}
</Modal>
