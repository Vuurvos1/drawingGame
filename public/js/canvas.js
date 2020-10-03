import Fill from './canvasFill.js';
import Paint from './canvasPaint.js';

const canvasId = '#canvas';
const canvasEl = document.querySelector(canvasId);
const ctx = canvasEl.getContext('2d');

const paint = new Paint(canvasId, socket);
// set defealt tools
paint.activeTool = 'brush';
paint.lineWidth = '3';
paint.color = '#000000';
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

    socket.emit('changeColor', color);
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
  ctx.lineWidth = data.lineWidth;
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
});

socket.on('changeColor', (col) => {
  ctx.strokeStyle = col;
});

socket.on('undoMove', (data) => {});

socket.on('erase', (data) => {
  ctx.clearRect(data.x, data.y, data.width, data.width);
});

// build canvas
// add canvas

// chat / place to guess

// let canvas = document.querySelector('main').appendChild(canvas);
// const canvas = document.querySelector('canvas');

// body.appendChild(canvas);
// document.querySelector('main').appendChild(canvas);
