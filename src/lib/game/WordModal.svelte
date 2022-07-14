<script>
	import { socket } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';

	export let words = [];
</script>

<!-- if timer runs out, pick random ( server side) -->
<div>
	{#each words as word, i}
		<Button
			on:click={() => {
				// emit word index
				$socket.emit('pickWord', i);
			}}>{word}</Button
		>
	{/each}
</div>

<style>
</style>
