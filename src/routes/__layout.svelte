<script>
	import { socket, users, user } from '$lib/stores';

	// Move this to [slug] route?
	$socket.on('setUsers', (data) => {
		console.log('set users', data);
		$users = data;
	});

	// user joins room
	$socket.on('joinRoom', (data) => {
		// data = { user, users }
		console.log('join room', data);
		$users = data.users;

		// const user = data.user;

		// // $userStore.id = user.id;

		// $users = data.users;
		// const index = users.findIndex((u) => u.id === user.id);

		// if (index >= 0) {
		// 	// update user if already in list
		// 	$users[index] = user;
		// } else {
		// 	$users.push(user);
		// }
	});

	$socket.on('setId', (id) => {
		$user.id = id;
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
