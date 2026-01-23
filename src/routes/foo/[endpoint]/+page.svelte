<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Hr, Button, ButtonGroup, P, PaginationNav } from 'flowbite-svelte';
	import { ChevronDoubleLeftOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';

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
