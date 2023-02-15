<script>
	import { goto } from '$app/navigation';

	export let data;
	const { roomName } = data;

	let customRoom = '';
</script>

<h1>Drawing game</h1>

<a href="/{roomName}">Goto room {roomName}</a>

<form
	on:submit|preventDefault={() => {
		if (customRoom.length >= 4) {
			goto(`/${customRoom}`);
		}
	}}
>
	<header>Join a private room</header>
	<input
		type="text"
		minlength="4"
		pattern="[A-Za-z0-9]+"
		required
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false"
		bind:value={customRoom}
	/>
	<button>Join</button>
</form>

<style lang="scss">
</style>
