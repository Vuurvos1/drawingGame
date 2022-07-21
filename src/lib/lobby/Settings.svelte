<script>
	import { socket } from '$lib/stores';
	import CustomTags from '$lib/components/CustomTags.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// TODO empty tags
	let customTags = ['foo', 'bar'];
	let customWordsOnly = false;
	let drawTime = 30;
	let rounds = 3;

	// TODO change so only host can change these values
</script>

<div>
	<div class="rounds">
		<label for="rounds">Rounds</label>
		<input
			type="number"
			name="rounds"
			id="rounds"
			bind:value={rounds}
			min="1"
			max="25"
			maxlength="3"
		/>
	</div>

	<div class="drawTime">
		<label for="drawTime" id="drawTime">Draw Time</label>
		<input type="number" name="drawTime" bind:value={drawTime} min="1" max="120" maxlength="3" />
	</div>

	<CustomTags bind:words={customTags} />

	<div class="customWordsCheck">
		<input
			class="checkbox"
			name="customWordsOnly"
			type="checkbox"
			id="customWordsOnly"
			bind:checked={customWordsOnly}
		/>
		<label for="customWordsOnly">Only use custom words</label>
	</div>

	<Button
		on:click={() => {
			// pass settings into start game
			// pass custom words to socket
			$socket.emit('gameStart', {
				drawTime,
				rounds,
				customTags,
				customWordsOnly
			});

			dispatch('gameStart', '');
		}}
	>
		Start Game
	</Button>
</div>

<style lang="scss">
	.rounds,
	.drawTime {
		// display: flex;
		// flex-direction: row;

		input {
			width: 100%;
			padding: 0.75rem 1rem;
			border-radius: 0.25rem;
			outline: none;
			border: 1px solid #000;
		}
	}
</style>
