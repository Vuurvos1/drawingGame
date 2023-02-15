<script>
	import Settings from '$lib/lobby/Settings.svelte';
	import UserList from '$lib/components/UserList.svelte';
	import Chat from '$lib/lobby/Chat.svelte';
</script>

<section class="lobby">
	<h1>Lobby</h1>

	<div class="lobby__grid">
		<div class="lobby__settings">
			<h2>Settings</h2>
			<Settings />
		</div>
		<div class="lobby__users">
			<h2>Users</h2>
			<UserList />
		</div>
		<div class="lobby__chat">
			<Chat />
		</div>
	</div>
</section>

<style lang="scss">
	h2 {
		margin-bottom: 1ch;
	}

	.lobby {
		&__grid {
			display: grid;
			grid-template-columns: repeat(10, minmax(0, 1fr));
			gap: 1rem;

			max-width: 1240px;
			margin: 0 auto;
			padding: 0 2rem;

			> div {
				background-color: #efefef;
				border-radius: 0.5rem;
				padding: 1.75rem 1.5rem;
			}
		}

		&__settings {
			grid-column: span 3;
		}

		&__users {
			grid-column: span 5;
		}

		&__chat {
			grid-column: span 2;
		}

		// & > div

		// color: hotpink;
	}

	// tablet
	@media screen and (min-width: 48rem) {
		// .grid {
		// 	grid-template-columns: repeat(8, minmax(1, 1fr));
		// }
	}

	// desktop
	@media screen and (min-width: 64rem) {
		// .grid {
		// 	grid-template-columns: repeat(12, minmax(1, 1fr));
		// }
	}
</style>
