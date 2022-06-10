<script>
	import { io } from 'socket.io-client';

	const socket = io();

	socket.on('serverEvent', (message) => {
		console.log(message);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style lang="scss">
</style>
