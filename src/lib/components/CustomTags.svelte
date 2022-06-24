<script>
	import { MinusIcon } from '$lib/icons';
	import Button from '$lib/ui/Button.svelte';

	// specify the custom words that the array will have
	export let words = [];

	// specify the maxium of tags that are allowed
	// export let maxTags = 10;
	// export let maxLength = 40;

	let inputValue = '';

	function handleKeydown(ev) {
		if (ev.key === 'Enter') {
			if (inputValue < 1) {
				return;
			}

			// TODO add maxTags and maxLength checks?
			const tags = inputValue
				.replace(/ +(?= )/g, '') // replace and remove unwanted spaces
				.split(',')
				.map((tag) => tag.trim()) // remove spaces before and after tags
				.filter((tag) => tag.length > 0 && !words.includes(tag)); // remove empty tags

			words = words.concat(tags);

			// reset input
			inputValue = '';
		}
	}

	// delete word at index
	function deleteTag(index) {
		words.splice(index, 1);
		// update words
		words = words;
	}

	// reset words array
	function deleteAllTags() {
		words = [];
	}
</script>

<div class="customTags">
	<div class="title">
		<h2>Tags</h2>
	</div>
	<div class="content">
		<p>Press enter or add a comma after each tag</p>
		<div class="tag-box">
			<ul>
				{#if words.length > 0}
					{#each words as word, index}
						<li>
							<span class="word">{word}</span>
							<button on:click={() => deleteTag(index)} class="close">
								<MinusIcon />
							</button>
						</li>
					{/each}
				{/if}
				<input
					type="text"
					name="customWords"
					class="input"
					on:keydown={handleKeydown}
					bind:value={inputValue}
					placeholder="Type your custom words here, separated by commas"
				/>
			</ul>
		</div>
	</div>
	<div class="details">
		<Button on:click={deleteAllTags}>Remove all tags</Button>
	</div>
</div>

<style lang="scss">
	/* TODO rewrite this */

	.customTags {
		max-width: 24rem;

		.title {
			display: flex;
			align-items: center;

			h2 {
				font-size: 21px;
				font-weight: 600;
				margin-left: 8px;
			}
		}

		.content {
			margin: 10px 0;
			font-size: 15px;
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			padding: 7px;
			border: 1px solid #a6a6a6;
			border-radius: 5px;
			margin: 12px 0px;
		}

		.content ul li {
			list-style: none;
			background-color: rgb(41, 46, 195);
			color: white;
			padding: 5px 8px 5px 10px;
			margin: 4px 3px;
			border-radius: 5px;
			border: 1px solid #e3d1e1;
			display: flex;
			align-items: center;
		}

		.word {
			margin-right: 8px;
			color: white;
		}

		.close {
			color: white;
		}

		ul .input {
			flex: 1;
			outline: none;
			padding: 5px;
			font-size: 16px;
			border: none;
		}

		.details {
			display: flex;
			justify-content: space-between;

			button {
				background-color: red;
				border-radius: 5px;
				color: white;
				padding: 0.5rem;
			}
		}
	}
</style>
