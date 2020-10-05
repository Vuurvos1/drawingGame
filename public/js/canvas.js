import Fill from './canvasFill.js';
import Paint from './canvasPaint.js';

const canvasId = '#canvas';
const canvasEl = document.querySelector(canvasId);
const ctx = canvasEl.getContext('2d');
let lineWidth = 3;

const paint = new Paint(canvasId, socket);
// set defealt tools
paint.activeTool = 'brush';
paint.lineWidth = 3;
paint.selectColor = '#000000';
// initialize paint
paint.init();

// add eventListener to drawing tools
document.querySelectorAll('[data-tool]').forEach((item) => {
  item.addEventListener('click', (e) => {
    const selectedTool = item.getAttribute('data-tool');
    console.log(selectedTool);

    if (selectedTool == 'undo') {
      paint.undoMove();

      // send undo to server
      socket.emit('undoMove');
    } else {
      paint.activeTool = selectedTool;
    }
  });
});

// add EventListener to brush sizes
document.querySelectorAll('[data-brushSize]').forEach((item) => {
  item.addEventListener('click', (e) => {
    const lineWidth = item.getAttribute('data-brushSize');
    console.log(lineWidth);
    paint.lineWidth = lineWidth;
  });
});

// add eventListener to brush color
document.querySelectorAll('[data-brushColor').forEach((item) => {
  item.style.backgroundColor = item.getAttribute('data-brushColor');
  item.addEventListener('click', (e) => {
    const color = item.getAttribute('data-brushColor');
    console.log(color);
    paint.selectColor = color;
  });
});

socket.on('floodFill', (data) => {
  new Fill(canvasEl, data.pos, data.col);
});

socket.on('startStroke', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});

socket.on('drawStroke', (data) => {
  ctx.lineWidth = lineWidth;
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
});

socket.on('changeColor', (col) => {
  ctx.strokeStyle = col;
});

socket.on('changeLineWidth', (width) => {
  lineWidth = width;
});

let undoStack = [];
const undoLimit = 3;
socket.on('saveMove', (data) => {
  const savedData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (undoStack.length >= undoLimit) {
    undoStack.shift();
  }
  undoStack.push(savedData);
});

socket.on('undoMove', (data) => {
  if (undoStack) {
    ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    undoStack.pop();
  }
});

socket.on('erase', (data) => {
  ctx.clearRect(data.x, data.y, lineWidth, lineWidth);
});
