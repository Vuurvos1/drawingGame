<script>
  import { onMount } from 'svelte';
  import { throttle, hexToRgba } from '../../modules/utils';
  import { socket, canvasTools } from '../../stores';

  let canvas;
  let canvasWidth;
  let canvasHeight;

  let drawing;
  let ctx;
  let current = {
    x: 0,
    y: 0,
  };

  canvasTools.subscribe((value) => {
    if (value.tool == 'delete') {
      // send this over socket
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      value.tool = 'brush';
    }
  });

  // move floodfill to seperate file?
  function getPixel(imageData, x, y) {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return [-1, -1, -1, -1]; // no shot this is a color lol
    } else {
      const offset = (y * imageData.width + x) * 4;
      return imageData.data.slice(offset, offset + 4);
    }
  }

  function setPixel(imageData, x, y, color) {
    const offset = (y * imageData.width + x) * 4;
    imageData.data[offset + 0] = color[0]; // red
    imageData.data[offset + 1] = color[1]; // green
    imageData.data[offset + 2] = color[2]; // blue
    imageData.data[offset + 3] = color[3]; // alpha
  }

  function colorsMatch(a, b) {
    // this is probably the fastest way of checking this but not the most elegant
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }

  function floodFill(ctx, x, y, fillColor) {
    // get pixels in canvas
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    // get the color we're filling
    const targetColor = getPixel(imageData, x, y);

    // check we are actually filling a different color
    if (!colorsMatch(targetColor, fillColor)) {
      const pixelsToCheck = [x, y];
      while (pixelsToCheck.length > 0) {
        const y = pixelsToCheck.pop();
        const x = pixelsToCheck.pop();

        const currentColor = getPixel(imageData, x, y);
        if (colorsMatch(currentColor, targetColor)) {
          setPixel(imageData, x, y, fillColor);
          pixelsToCheck.push(x + 1, y);
          pixelsToCheck.push(x - 1, y);
          pixelsToCheck.push(x, y + 1);
          pixelsToCheck.push(x, y - 1);
        }
      }

      ctx.putImageData(imageData, 0, 0); // draw the data
    }
  }

  function onMouseDown(e) {
    const mousePos = getMouseCanvasCords(e);

    if ($canvasTools.tool == 'fill') {
      const w = canvas.width;
      const h = canvas.height;

      const color = hexToRgba($canvasTools.color);

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

  $socket.on('floodfill', (data) => {
    const w = canvas.width;
    const h = canvas.height;

    // move color conversion into floodfill funciton?
    floodFill(ctx, data.x * w, data.y * h, data.color);
  });

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
