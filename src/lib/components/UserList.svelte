<script>
	import { users } from '$lib/stores';
	import User from '$lib/components/User.svelte';
</script>

<ul class="user-list">
	{#if $users}
		{#each $users as user}
			<li>
				<User {user} />
			</li>
		{/each}
	{/if}
</ul>

<style lang="scss">
	.user-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
