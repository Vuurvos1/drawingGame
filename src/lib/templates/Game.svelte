<script>
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Toolbox from '$lib/canvas/Toolbox.svelte';
	import Chat from '$lib/lobby/Chat.svelte';
	import Leaderboard from '$lib/game/Leaderboard.svelte';
</script>

<div class="game">
	<div class="game__leaderboard">
		<Leaderboard />
	</div>

	<div class="game__canvas">
		<Canvas />

		<Toolbox />
	</div>

	<div class="game__chat">
		<Chat />
	</div>
</div>

<style lang="scss">
	.game {
		display: grid;
		grid-template-columns: repeat(10, minmax(0, 1fr));
		gap: 1rem;

		max-width: 1240px;
		margin: 0 auto;
		padding: 0 2rem;

		& > div {
			border-radius: 0.5rem;
		}

		&__leaderboard {
			grid-column: span 2;
			background-color: #efefef;
		}

		&__canvas {
			grid-column: span 6;
		}

		&__chat {
			grid-column: span 2;
			background-color: #efefef;
		}

		:global(canvas) {
			border: 1px solid black;
			border-radius: 0.25rem;
		}
	}
</style>
