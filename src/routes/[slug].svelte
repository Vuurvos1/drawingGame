<script>
	import { page } from '$app/stores';
	import { socket } from '$lib/stores';
	import Chat from '$lib/lobby/Chat.svelte';

	let room = $page.params.slug;

	$socket.emit('join', room);
</script>

<p>Room: {room}</p>

<Chat />

<style>
</style>
