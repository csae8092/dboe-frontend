<svelte:options runes={true} />

<script>
	import { Modal, Input, Label, Button, Heading } from 'flowbite-svelte';
	let { open = $bindable(false), rowData, ignoreFields, userToken } = $props();

	async function handleSubmit(event) {
		event.preventDefault();
		let url = rowData.url;
		let filteredData = Object.keys(rowData)
			.filter((key) => !ignoreFields.includes(key) && rowData[key] !== null)
			.reduce((obj, key) => {
				obj[key] = rowData[key];
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
					{#each Object.keys(rowData) as key}
						{#if !ignoreFields.includes(key)}
							<div>
								<Label for={key}>{key}</Label>
								<Input type="text" id={key} bind:value={rowData[key]} />
							</div>
						{/if}
					{/each}
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	{/if}
</Modal>
