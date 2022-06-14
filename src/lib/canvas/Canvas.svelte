<script>
	import { onMount } from 'svelte';

	import { throttle } from '$lib/utils';

	let canvas;
	let ctx;

	function onMouseDown(e) {}

	function onMouseUp(e) {}

	function onMouseMove(e) {}

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<canvas
	bind:this={canvas}
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mouseout={onMouseUp}
	on:blur={onMouseUp}
	on:mousemove={throttle(onMouseMove, 10)}
	on:touchstart={onMouseDown}
	on:touchend={onMouseUp}
	on:touchcancel={onMouseUp}
	on:touchmove={throttle(onMouseMove, 10)}
/>
