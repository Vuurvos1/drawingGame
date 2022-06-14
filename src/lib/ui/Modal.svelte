<script>
	export let open = false;
</script>

{#if open}
	<dialog class="modal">
		<slot />
	</dialog>
{/if}

<style lang="scss">
	.modal {
		padding: 1rem;
		border: 0;

		&::backdrop {
			background-color: rgba(0, 0, 0, 0.5);
		}
	}
</style>
