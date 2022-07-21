<script>
	import { Bucket, Eraser, Pencil, Trash } from '$lib/icons';
	import { canvasTool } from '$lib/stores';

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
	$canvasTool.color = colors[11];

	const tools = ['brush', 'erase', 'fill', 'delete'];
	$canvasTool.tool = tools[0];

	const sizes = [3, 5, 10, 15, 20];
	$canvasTool.size = sizes[1];
</script>

<div class="toolbox">
	<div class="toolbox__colorPreview" style:background-color={$canvasTool.color} />

	<div class="toolbox__colors">
		<!-- TODO change these to radio buttons? -->
		{#each colors as color}
			<button
				class="toolbox__color"
				style:background-color={color}
				on:click={() => {
					$canvasTool.color = color;
				}}
			/>
		{/each}
	</div>

	<div class="toolbox__brushes">
		{#each sizes as size}
			<button
				class="toolbox__brush"
				class:active={$canvasTool.size == size}
				on:click={() => {
					$canvasTool.size = size;
				}}
			>
				<div style:width="{size}px" style:height="{size}px" />
			</button>
		{/each}
	</div>

	<div class="toolbox__tools">
		{#each tools as tool}
			<button
				class="toolbox__tool"
				class:active={$canvasTool.tool == tool}
				on:click={() => {
					if (tool === 'delete') {
						const previous = $canvasTool.tool;
						$canvasTool.tool = tool;
						// reset tool after delete
						$canvasTool.tool = previous;
					} else {
						$canvasTool.tool = tool;
					}
				}}
			>
				{#if tool == 'brush'}
					<Pencil size="24" />
				{:else if tool == 'erase'}
					<Eraser size="24" />
				{:else if tool == 'fill'}
					<Bucket size="24" />
				{:else if tool == 'delete'}
					<Trash size="24" />
				{/if}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.toolbox {
		display: flex;
		flex-direction: row;
		column-gap: 0.75rem;

		justify-content: center;

		&__colors {
			border-radius: 0.25rem;

			display: grid;
			grid-template-columns: repeat(11, minmax(0, 1fr));
			width: fit-content;
		}

		&__color {
			width: 1.25rem;
			height: 1.25rem;

			button {
				border: 1px solid black;
			}
		}

		&__colorPreview {
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 0.25rem;
		}

		&__brushes {
			display: flex;
			flex-direction: row;
			column-gap: 0.25rem;

			button {
				border: 1px solid black;
				border-radius: 0.25rem;
			}
		}

		&__brush,
		&__tool {
			width: 2.5rem;
			height: 2.5rem;

			display: flex;
			justify-content: center;
			align-items: center;

			&.active {
				background-color: #f0f0f0;
			}
		}

		&__brush {
			div {
				background-color: black;
				border-radius: 24rem;
			}
		}

		&__tools {
			display: flex;
			flex-direction: row;
			column-gap: 0.25rem;

			button {
				border: 1px solid black;
				border-radius: 0.25rem;
			}
		}

		&__tool {
		}
	}
</style>
