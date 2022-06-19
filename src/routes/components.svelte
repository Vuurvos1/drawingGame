<script>
	// this page is for testing only

	import Toolbox from '../lib/canvas/Toolbox.svelte';
	import Canvas from '../lib/canvas/Canvas.svelte';
	import CharacterCreator from '../lib/lobby/CharacterCreator.svelte';
	import UserList from '../lib/components/UserList.svelte';

	import { socket, user } from '$lib/stores';

	$socket.emit('join', 'components');
	$socket.on('join', (id) => {
		$user.id = id;
	});
</script>

<Canvas />

<Toolbox />

<CharacterCreator />

<UserList />
