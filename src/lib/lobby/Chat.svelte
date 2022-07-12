<script>
	import { socket, user } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	import { beforeUpdate, afterUpdate } from 'svelte';

	let div;
	let autoscroll;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	// socket evetns
	// on chat message
	// message, user

	let messages = [];
	let message = '';

	$socket.on('chat', (message) => {
		messages = messages.concat(message);
	});

	function sendMessage() {
		message = message.trim(); // remove whitespace before and after text

		if (message.trim() == '') return; // if message is empty don't do anything

		messages = messages.concat({ text: message, user: $user });
		// username could be filled in on the server?
		$socket.emit('chat', {
			text: message,
			user: $user
		});

		message = '';
	}

	function handleKeydown(ev) {
		if (ev.key === 'Enter') {
			sendMessage();
		}
	}
</script>

<div class="chat">
	<div class="chat__messages scrollable" bind:this={div}>
		{#each messages as message}
			<article>
				<span>{message.user.name}</span>
				<span>{message.text}</span>
			</article>
		{/each}
	</div>

	<div class="chat__form">
		<!-- chage this to be a form? -->
		<TextInput bind:value={message} on:keydown={handleKeydown} />
		<Button on:click={sendMessage}>Send</Button>
	</div>
</div>

<style lang="scss">
	.chat {
		display: flex;
		flex-direction: column;

		max-width: 320px;

		// TODO remove this
		max-height: 20rem;

		&__messages {
			span:first-child {
				font-weight: bold;
			}
		}

		&__form {
		}
	}

	article {
		margin: 0.5em 0;
	}

	.scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	}
</style>
