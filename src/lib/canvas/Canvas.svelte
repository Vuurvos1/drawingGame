<script>
	import { onMount } from 'svelte';
	import { throttle } from '$lib/utils';
	import { socket, canvasTool } from '$lib/stores';

	let canvas;
	let canvasWidth;
	let canvasHeight;
	let drawing;
	let ctx;
	let current = {
		x: 0,
		y: 0
	};

	function onMouseDown(e) {
		const mousePos = getMouseCanvasCords(e);
		if (mousePos === -1) return;

		if ($canvasTool.tool == 'fill') {
			const w = canvasWidth;
			const h = canvasHeight;
			const color = $canvasTool.color;
			$socket.emit('floodfill', {
				x: mousePos.x / w,
				y: mousePos.y / h,
				color: color
			});
			floodfill(ctx, mousePos.x, mousePos.y, color);
			return;
		}

		drawing = true;
		current.x = mousePos.x;
		current.y = mousePos.y;
	}

	function onMouseUp(e) {
		if (!drawing) {
			return;
		}
		drawing = false;
		const mousePos = getMouseCanvasCords(e);
		drawLine(
			current.x,
			current.y,
			mousePos.x,
			mousePos.y,
			$canvasTool.color,
			$canvasTool.size,
			'brush',
			true
		);
	}

	function onMouseMove(e) {
		if (!drawing) {
			return;
		}
		const mousePos = getMouseCanvasCords(e);
		drawLine(
			current.x,
			current.y,
			mousePos.x,
			mousePos.y,
			$canvasTool.color,
			$canvasTool.size,
			'brush',
			true
		);

		current.x = mousePos.x;
		current.y = mousePos.y;
	}

	// socket events
	$socket.on('draw', (data) => {
		onDrawingEvent(data);
	});

	$socket.on('floodfill', (data) => {
		const w = canvasWidth;
		const h = canvasHeight;
		floodfill(ctx, data.x * w, data.y * h, data.color);
	});

	// util functions
	function onDrawingEvent(data) {
		const w = canvasWidth;
		const h = canvasHeight;
		drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.width, data.tool);
	}

	function drawLine(x0, y0, x1, y1, color, width, tool, emit) {
		if (tool == 'erase') {
			ctx.globalCompositeOperation = 'destination-out';
		} else {
			ctx.globalCompositeOperation = 'source-over';
			ctx.strokeStyle = color;
		}
		ctx.lineWidth = width;
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.stroke();
		ctx.closePath();
		if (!emit) {
			return;
		}
		// TODO bind these?
		const w = canvasWidth;
		const h = canvasHeight;
		$socket.emit('draw', {
			x0: x0 / w,
			y0: y0 / h,
			x1: x1 / w,
			y1: y1 / h,
			color: color,
			width: width,
			tool: tool
		});
	}

	// TODO this could probably done more "svelte"
	$: canvasRect = canvas?.getBoundingClientRect();
	function getMouseCanvasCords(e) {
		const touch = e.touches ? e.touches[0] : e;
		if (typeof touch === 'undefined') {
			return -1;
		}
		return {
			x: touch.clientX - canvasRect.left,
			y: touch.clientY - canvasRect.top
		};
	}

	let FloodFill;
	function floodfill(ctx, x, y, fillColor) {
		if (FloodFill) {
			// get image data
			const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
			// Construct flood fill instance
			const flood = new FloodFill(imgData);
			// Modify image data
			flood.fill(fillColor, x, y, 1);
			// put the modified data back in context
			ctx.putImageData(flood.imageData, 0, 0);
		}
	}

	onMount(async () => {
		ctx = canvas.getContext('2d');

		const obj = await import('q-floodfill');
		FloodFill = obj.default;
	});
</script>

<canvas
	bind:this={canvas}
	bind:clientWidth={canvasWidth}
	bind:clientHeight={canvasHeight}
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
