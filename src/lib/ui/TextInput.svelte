<script>
	export let value = '';
	export let placeholder = undefined;
</script>

<input type="text" {placeholder} bind:value on:keydown />

<style lang="scss">
	input {
		width: 100%;

		padding: 0.5rem 0.75rem;
		margin-bottom: 1rem;

		border: 1px solid black;
		border-radius: 0.25rem;

		line-height: 1.25;

		&:focus {
			outline: none;
		}
	}
</style>
