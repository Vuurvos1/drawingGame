<script>
	import { user as userStore } from '$lib/stores';
	import UserAvatar from './UserAvatar.svelte';

	export let user;
</script>

<div class="user" class:self={user.id === $userStore.id}>
	<UserAvatar size="4rem" avatar={user.avatar} />
	<span class="user__name">{user.id === $userStore.id ? 'self' : user.name}</span>
</div>

<style lang="scss">
	.user {
		display: flex;
		flex-direction: column;
		align-items: center;

		&.self {
			color: hotpink;
		}
	}
</style>
