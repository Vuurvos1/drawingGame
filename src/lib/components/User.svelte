<script>
	import { user as userStore } from '$lib/stores';

	export let user;
</script>

<div class="user" class:self={user.id === $userStore.id}>
	<span class="user__avatar" style:background-color={user.avatar} />
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

		&__avatar {
			width: 4rem;
			height: 4rem;

			border-radius: 64rem;
		}
	}
</style>
