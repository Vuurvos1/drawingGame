<script>
	const colors = [
		'#FFFFFF',
		'#C1C1C1',
		'#EF130B',
		'#FF7100',
		'#FFE400',
		'#00CC00',
		'#00B2FF',
		'#231FD3',
		'#A300BA',
		'#D37CAA',
		'#A0522D',
		'#000000',
		'#4C4C4C',
		'#740B07',
		'#C23800',
		'#E8A200',
		'#005510',
		'#00569E',
		'#0E0865',
		'#550069',
		'#A75574',
		'#63300D'
	];

	const tools = ['brush', 'erase', 'fill', 'delete'];

	const brushes = [3, 5, 10, 15, 20];
</script>

<div class="toolbox">
	<div class="toolbox__colors">
		<!-- change these to radio buttons? -->
		{#each colors as color}
			<button class="toolbox__color" style:background-color={color} on:click={() => {}} />
		{/each}
	</div>

	<div class="toolbox__brushes">
		{#each brushes as brush}
			<button class="toolbox__brush" class:active={false} on:click={() => {}}
				><div class="toolbox__brush" style={`width: ${brush}px;height: ${brush}px`} /></button
			>
		{/each}
	</div>

	<div class="toolbox__tools">
		{#each tools as tool}
			<button class:active={false} on:click={() => {}}>
				{#if tool == 'brush'}
					<!-- <Edit2Icon size="24" /> -->
				{:else if tool == 'erase'}
					<!-- <Eraser size="24" /> -->
				{:else if tool == 'fill'}
					<!-- <Bucket size="24" /> -->
				{:else if tool == 'delete'}
					<!-- <Trash2Icon size="24" /> -->
				{/if}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.toolbox {
		&__colors {
		}

		&__color {
			width: 1.25rem;
			height: 1.25rem;
		}

		&__brushes {
		}

		&__brush {
		}

		&__tools {
		}

		&__tool {
		}
	}
</style>
