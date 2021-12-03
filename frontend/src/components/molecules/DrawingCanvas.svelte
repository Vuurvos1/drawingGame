<script>
  import { onMount } from 'svelte';
  import { throttle, hexToRgba } from '../../modules/utils';
  import {
    setPixel,
    getPixel,
    colorsMatch,
  } from '../../modules/floodfillUtils';
  import { socket, gameManager } from '../../stores';

  let canvas;
  let canvasWidth;
  let canvasHeight;

  let drawing;
  let ctx;
  let current = {
    x: 0,
    y: 0,
  };

  gameManager.subscribe((value) => {
    if (value.tool.tool == 'delete') {
      // send this over socket
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      value.tool.tool = 'brush';
    }
  });

  // move floodfill to seperate file?
  // TODO optimize call stack so page doesn't crash?
  function floodFill(ctx, x, y, fillColor, range = 1) {
    // read the pixels in the canvas
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    // flags for if we visited a pixel already
    const visited = new Uint8Array(imageData.width, imageData.height);

    // get the color we're filling
    const targetColor = getPixel(imageData, x, y);

    let fillsStack = [];

    // check we are actually filling a different color

    // get pixels
    if (!colorsMatch(targetColor, fillColor)) {
      const rangeSq = range * range;
      const pixelsToCheck = [x, y];
      while (pixelsToCheck.length > 0) {
        const y = pixelsToCheck.pop();
        const x = pixelsToCheck.pop();

        const currentColor = getPixel(imageData, x, y);
        if (
          !visited[y * imageData.width + x] &&
          colorsMatch(currentColor, targetColor, rangeSq)
        ) {
          setPixel(imageData, x, y, fillColor);
          visited[y * imageData.width + x] = 1; // mark we were here already
          pixelsToCheck.push(x + 1, y);
          pixelsToCheck.push(x - 1, y);
          pixelsToCheck.push(x, y + 1);
          pixelsToCheck.push(x, y - 1);
        }
      }

      // fill pixels
      if (fillsStack.length > 0) {
        const stackLength = fillsStack.length;
        for (let i = 0; i < stackLength; i++) {}
      } else {
        ctx.putImageData(imageData, 0, 0);
        fillsStack = [];
      }

      // put the data back
      ctx.putImageData(imageData, 0, 0);
    }
  }

  function onMouseDown(e) {
    const mousePos = getMouseCanvasCords(e);
    if (mousePos === -1) return;

    if ($gameManager.tool.tool == 'fill') {
      const w = canvasWidth;
      const h = canvasHeight;

      const color = hexToRgba($gameManager.tool.color);

      $socket.emit('floodfill', {
        x: mousePos.x / w,
        y: mousePos.y / h,
        color: color,
      });
      floodFill(ctx, mousePos.x, mousePos.y, color);
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
      $gameManager.tool.color,
      $gameManager.tool.size,
      $gameManager.tool.tool,
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
      $gameManager.tool.color,
      $gameManager.tool.size,
      $gameManager.tool.tool,
      true
    );

    current.x = mousePos.x;
    current.y = mousePos.y;
  }

  function onDrawingEvent(data) {
    // bind these
    const w = canvasWidth;
    const h = canvasHeight;

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
    const touch = e.touches ? e.touches[0] : e;

    if (typeof touch === 'undefined') {
      return -1;
    }

    return {
      x: touch.clientX - canvasRect.left,
      y: touch.clientY - canvasRect.top,
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
    const w = canvasWidth;
    const h = canvasHeight;

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

  $socket.on('floodfill', (data) => {
    const w = canvasWidth;
    const h = canvasHeight;

    // move color conversion into floodfill funciton?
    floodFill(ctx, data.x * w, data.y * h, data.color);
  });

  onMount(() => {
    ctx = canvas.getContext('2d');
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
