<script>
	import { socket, users, user as userStore } from '$lib/stores';
	import User from './User.svelte';
</script>

<ul class="user-list">
	<!-- <li class="self">
		<User user={{ avatar: $userStore.avatar, name: 'self' }} />
	</li> -->

	{#if $users && $users.length > 0}
		{#each $users as user}
			<li>
				<User {user} />
				<!-- <pre>{JSON.stringify(user, null, 2)}</pre>
				<pre>{JSON.stringify($userStore, null, 2)}</pre> -->
			</li>
		{/each}
	{/if}
</ul>

<style lang="scss">
	.user-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
		grid-template-rows: auto;
		gap: 1rem;
	}
</style>
