<script>
	import { Hr, P } from 'flowbite-svelte';
	import NewTableNav from '$lib/components/NewTableNav.svelte';
	import TableSize from '$lib/components/TableSize.svelte';
	let { data } = $props();
</script>

<NewTableNav {data}></NewTableNav>
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
