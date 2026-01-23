<script>
	import { Hr, Button, ButtonGroup, P, PaginationNav } from 'flowbite-svelte';
	import { ChevronDoubleLeftOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	let { data, loading = false } = $props();
</script>

<ButtonGroup>
	<Button href={data.previous_page} disabled={!data.previous_page || loading}>
		<ChevronDoubleLeftOutline class="h-6 w-6" />
		Vorige Seite
	</Button>

	<Button href={data.next_page} disabled={!data.next_page || loading}>
		Nächste Seite
		<ChevronDoubleRightOutline class="h-6 w-6" />
	</Button>
</ButtonGroup>
