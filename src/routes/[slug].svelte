<script>
	import { page } from '$app/stores';
	import { socket } from '$lib/stores';
	import Chat from '$lib/lobby/Chat.svelte';
	import Settings from '$lib/lobby/Settings.svelte';
	import CharacterCreator from '$lib/lobby/CharacterCreator.svelte';
	import UserList from '$lib/components/UserList.svelte';
	import WordModal from '$lib/game/WordModal.svelte';
	import Leaderboard from '$lib/game/Leaderboard.svelte';
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Toolbox from '$lib/canvas/Toolbox.svelte';

	let room = $page.params.slug;
	let gameState = 'character'; // TODO change this to be a store?

	$socket.emit('join', room);

	$socket.on('gameStart', (data) => {
		gameState = 'game';
	});
</script>

{#if gameState === 'character'}
	<CharacterCreator
		on:joinRoom={() => {
			gameState = 'lobby';
		}}
	/>
{:else if gameState === 'lobby'}
	<Settings
		on:gameStart={() => {
			gameState = 'game';
		}}
	/>

	<p>Room: {room}</p>
	<Chat />

	<UserList />
{:else if gameState === 'game'}
	<Canvas />

	<Toolbox />

	<Leaderboard />

	<Chat />

	<!-- <WordModal /> -->
{:else}
	<h1>Invalid game state</h1>
{/if}

<style lang="scss">
</style>
