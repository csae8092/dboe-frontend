<script>
	import { Hr, Button, ButtonGroup, P, PaginationNav } from 'flowbite-svelte';
	import { ChevronDoubleLeftOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	let { data } = $props();
</script>

<ButtonGroup>
	<Button href={data.previous_page} disabled={!data.previous_page}>
		<ChevronDoubleLeftOutline class="h-6 w-6" />
		Vorige Seite
	</Button>

	<Button href={data.next_page} disabled={!data.next_page}>
		Nächste Seite
		<ChevronDoubleRightOutline class="h-6 w-6" />
	</Button>
</ButtonGroup>
