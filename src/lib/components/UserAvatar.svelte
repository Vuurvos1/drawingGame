<script>
	export let size = '4rem';
	export let avatar;
</script>

<div class="userAvatar">
	<div style:width={size} style:height={size} style:background-color={avatar} />
</div>

<style lang="scss">
	.userAvatar {
		& > div {
			border-radius: 64rem;
		}
	}
</style>
