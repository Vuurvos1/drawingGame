<script>
	import { users, user as userStore } from '$lib/stores';
	import { derived } from 'svelte/store';

	const userOrder = derived(users, ($users) => [...$users].sort((a, b) => b.score - a.score));
</script>

<!-- TODO show person currently drawing -->
<ul class="leaderboard">
	{#each $userOrder as user, i}
		<li>
			<p class="leaderboard__index">
				#{i + 1}
			</p>

			<div class="leaderboard__avatar" style:background-color={user.avatar} />

			<div>
				<p>{user.name}{user.id == $userStore.id ? ' [You]' : ''}</p>
				<p>Points: {user.score ? user.score : 0}</p>
			</div>
		</li>
	{/each}
</ul>

<style lang="scss">
	.leaderboard {
		li {
			display: flex;
			flex-direction: row;
			align-items: center;

			margin-bottom: 0.5rem;
		}

		&__index {
			margin-right: 0.5rem;

			font-size: 1.25rem;
			font-weight: 700;
		}

		&__avatar {
			width: 2rem;
			height: 2rem;

			margin-right: 0.75rem;

			border-radius: 64rem;
		}
	}
</style>
