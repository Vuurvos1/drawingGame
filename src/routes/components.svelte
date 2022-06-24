<script>
	// this page is for testing only

	import Toolbox from '$lib/canvas/Toolbox.svelte';
	import Canvas from '$lib/canvas/Canvas.svelte';
	import CharacterCreator from '$lib/lobby/CharacterCreator.svelte';
	import UserList from '$lib/components/UserList.svelte';
	import Chat from '$lib/lobby/Chat.svelte';
	import Settings from '$lib/lobby/Settings.svelte';

	import { socket } from '$lib/stores';
	import Leaderboard from '../lib/game/Leaderboard.svelte';

	$socket.emit('join', 'components');
</script>

<Canvas />

<Toolbox />

<CharacterCreator />

<UserList />

<Chat />

<Leaderboard />

<Settings />
