<svelte:options runes={true} />

<script>
	import { Heading, TextPlaceholder } from 'flowbite-svelte';
</script>

<div id="placeholder" class="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col items-center justify-center px-4">
	<Heading tag="h2">Loading...</Heading>
	<TextPlaceholder size="xl"></TextPlaceholder>
</div>
