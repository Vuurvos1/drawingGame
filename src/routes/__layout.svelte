<script>
	import { socket, users, user } from '$lib/stores';

	// global socket events

	// Move events to [slug] route?

	// set all users
	$socket.on('setUsers', (data) => {
		console.log('set users', data);
		$users = data;
	});

	// set user id (self)
	$socket.on('setUser', (data) => {
		console.log('set user', data);
		$user = data;
	});

	// user joins room
	$socket.on('joinRoom', (data) => {
		console.log('join room', data);
		$users = data.users;
	});

	// user leaves room
	$socket.on('leaveRoom', (id) => {
		$users = $users.filter((user) => user.id !== id);
	});
</script>

<slot />

<style lang="scss" global>
	@import '../lib/reset.scss';
</style>
