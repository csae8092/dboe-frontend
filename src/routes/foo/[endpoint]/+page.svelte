<script>
	import { Hr, P } from 'flowbite-svelte';
	import NewTableNav from '$lib/components/NewTableNav.svelte';
	import TableSize from '$lib/components/TableSize.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { data } = $props();
	let loading = $state(false);

	onMount(() => {
		beforeNavigate(() => {
			loading = true;
		});
		afterNavigate(() => {
			loading = false;
		});
	});
</script>

<NewTableNav {data} {loading}></NewTableNav>
<P>{data.payload.count}</P>
<TableSize></TableSize>
<Hr />

<ul>
	{#each data.payload.results as x (x.id)}
		<li>
			{x.id}
		</li>
	{/each}
</ul>
