<script>
	import { Hr, P } from 'flowbite-svelte';
	import NewTableNav from '$lib/components/NewTableNav.svelte';
	let { data } = $props();
</script>

<NewTableNav {data}></NewTableNav>
<P>{data.payload.count}</P>
<Hr />

<ul>
	{#each data.payload.results as x (x.id)}
		<li>
			{x.id}
		</li>
	{/each}
</ul>
