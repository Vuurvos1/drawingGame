<script>
	import { page } from '$app/stores';

	import { socket } from '$lib/stores';

	let room = $page.params.slug;

	let message = '';
	let messages = [];

	$socket.emit('join', room);

	$socket.on('chat', (message) => {
		messages = [...messages, message];
	});

	function sendChat() {
		messages = [...messages, message];
		$socket.emit('chat', message);
		message = '';
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			sendChat();
		}
	}
</script>

<p>Room: {room}</p>

<div>
	{#each messages as message}
		<p>
			{message}
		</p>
	{/each}
</div>

<div>
	<input bind:value={message} on:keydown={handleKeyDown} type="text" />
	<button on:click={sendChat}>Send</button>
</div>

<style>
</style>
