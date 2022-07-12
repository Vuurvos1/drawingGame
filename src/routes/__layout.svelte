<script>
	import { socket, user } from '$lib/stores';

	// global socket events

	// Move events to [slug] route?

	// set user id (self)
	$socket.on('setUser', (data) => {
		$user = data;
	});
</script>

<slot />

<style lang="scss" global>
	@import '../lib/reset.scss';
</style>
