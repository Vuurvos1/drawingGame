<script>
	import Button from '$lib/ui/Button.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { Chevron, RotateCW } from '$lib/icons';
	import { socket, user } from '$lib/stores';
	import { page } from '$app/stores';

	let avatarColors = ['#f97316', '#22c55e', '#0ea5e9', '#a855f7', '#ec4899', '#f43f5e'];
	let colorIndex = 0;

	// TODO fix avatar image flicker
	if ($user.avatar) {
		colorIndex = avatarColors.indexOf($user.avatar);
	}

	if ($user.avatar === '') {
		$user.avatar = avatarColors[colorIndex];
	}

	if ($user.name !== '' && $user.avatar !== '') {
		$socket.emit('getUsers', '');
	}
</script>

<div class="create">
	<div class="create__header">
		<button
			class="create__back"
			on:click={() => {
				colorIndex--;
				if (colorIndex < 0) {
					colorIndex = avatarColors.length - 1;
				}
				$user.avatar = avatarColors[colorIndex];
			}}
		>
			<Chevron direction="left" />
		</button>

		<div class="create__avatar">
			<div class="create__avatar-icon" style:background-color={avatarColors[colorIndex]} />
			<button
				class="create__reset"
				on:click={() => {
					colorIndex = ~~(Math.random() * avatarColors.length);
					$user.avatar = avatarColors[colorIndex];
				}}
			>
				<RotateCW />
			</button>
		</div>

		<button
			class="create_next"
			on:click={() => {
				colorIndex++;
				if (colorIndex >= avatarColors.length) {
					colorIndex = 0;
				}
				$user.avatar = avatarColors[colorIndex];
			}}
		>
			<Chevron direction="right" />
		</button>
	</div>
	<TextInput bind:value={$user.name} placeholder="username" />
</div>

<Button
	on:click={() => {
		// also do this server side?
		if ($user.name !== '' || $user.avatar !== '') {
			$socket.emit('joinRoom', { user: $user, room: $page.params.slug });
		}
	}}
>
	<!-- if already in lobby/game change text to update? -->
	Join game
</Button>

<style lang="scss">
	.create {
		max-width: 24rem;

		&__header {
			display: flex;
			justify-content: center;
			align-items: center;

			margin-bottom: 1rem;
		}

		&__back {
		}

		&__next {
		}

		&__avatar {
			position: relative;
		}

		&__avatar-icon {
			width: 8rem;
			height: 8rem;

			background-color: hotpink;
			border-radius: 64rem;
		}

		&__reset {
			position: absolute;
			bottom: 0;
			right: 0;
			line-height: 0;

			padding: 0.5rem;
			background-color: #fff;
			border-radius: 64rem;

			box-shadow: 0 0 0.75rem 0 rgba(0, 0, 0, 0.25);
		}
	}
</style>
