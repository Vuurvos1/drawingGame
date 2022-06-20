<script>
	import { users } from '$lib/stores';
	import User from './User.svelte';
</script>

<ul class="user-list">
	{#if $users && $users.length > 0}
		{#each $users as user}
			<li>
				<User {user} />
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
