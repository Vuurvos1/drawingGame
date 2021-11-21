<script>
  import { onMount } from 'svelte';
  import { throttle } from '../../modules/utils';
  import { socket, canvasTools } from '../../store';

  let canvas;
  let canvasWidth;
  let canvasHeight;

  let drawing;
  let ctx;
  let current = {
    x: 0,
    y: 0,
  };

  function onMouseDown(e) {
    drawing = true;

    const mousePos = getMouseCanvasCords(e);
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
      $canvasTools.color,
      $canvasTools.size,
      $canvasTools.tool,
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
      $canvasTools.color,
      $canvasTools.size,
      $canvasTools.tool,
      true
    );

    current.x = mousePos.x;
    current.y = mousePos.y;
  }

  function onDrawingEvent(data) {
    // bind these
    const w = canvas.width;
    const h = canvas.height;
    drawLine(
      data.x0 * w,
      data.y0 * h,
      data.x1 * w,
      data.y1 * h,
      data.color,
      data.width,
      data.tool
    );
  }

  $: canvasRect = canvas?.getBoundingClientRect();
  function getMouseCanvasCords(e) {
    // get mouse position relative to the canvas
    return {
      x: e.clientX - canvasRect.left || e.touches[0].clientX - canvasRect.left,
      y: e.clientY - canvasRect.top || e.touches[0].clientY - canvasRect.top,
    };
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

    // bind these
    const w = canvas.width;
    const h = canvas.height;

    $socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      width: width,
      tool: tool,
    });
  }

  $socket.on('drawing', onDrawingEvent);

  onMount(() => {
    ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
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

<style></style>
