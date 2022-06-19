<script>
	import { socket, user } from '$lib/stores';

	// socket evetns
	// on chat message
	// message, user

	let messages = [];
	let message = '';

	function sendMessage() {
		messages = [...messages, message];
		// username could be filled in on the server?
		$socket.emit('chat', {
			message,
			user: $user.name
		});

		message = '';
	}

	function handleKeydown(ev) {
		if (ev.key === 'Enter') {
			sendMessage();
		}
	}
</script>

{#each messages as message}
	<article>
		<span>{message.username}</span>
		<span>{message.message}</span>
	</article>
{/each}

<input type="text" bind:value={message} on:keydown={handleKeydown} />
<button on:click={sendMessage}>Send</button>
