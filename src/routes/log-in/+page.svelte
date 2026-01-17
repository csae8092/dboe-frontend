<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem, Heading, Input, Label, Button, Alert } from 'flowbite-svelte';
	import { HomeOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { user } from '$lib/stores';
	import { AUTH_URL } from '$lib/constants';

	let pageTitle = 'Log in';
	let username = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch(AUTH_URL, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password
				})
			});

			if (response.ok) {
				const data = await response.json();
				user.login(username, data.token);
				goto(resolve('/'));
			} else {
				error = 'Invalid username or password';
			}
		} catch (err) {
			error = 'Failed to connect to the server';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Breadcrumb aria-label="Breadcrumbs" class="px-5 py-3">
	<BreadcrumbItem href={resolve('/')} home>
		{#snippet icon()}
			<HomeOutline class="h-4 w-4" />
		{/snippet}Home
	</BreadcrumbItem>
	<BreadcrumbItem href={resolve('/log-in')}>
		{#snippet icon()}
			<ChevronRightOutline class="h-4 w-4 dark:text-white" />
		{/snippet}
		{pageTitle}
	</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h1">{pageTitle}</Heading>

{#if error}
	<Alert color="red" class="mb-4">
		{error}
	</Alert>
{/if}

<form on:submit={handleSubmit}>
	<div class="mb-6 grid gap-6 md:grid-cols-2">
		<div>
			<Label for="username" class="mb-2">Username</Label>
			<Input type="text" id="username" bind:value={username} required />
		</div>
		<div>
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" bind:value={password} required />
		</div>
	</div>
	<Button type="submit" disabled={loading}>
		{loading ? 'Logging in...' : 'Submit'}
	</Button>
</form>
