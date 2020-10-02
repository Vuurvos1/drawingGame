import Tool from './canvasTools.js';
import Paint from './canvasPaint.js';

let paint = new Paint('#canvas');
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
  });
});

// build canvas
// add canvas

// chat / place to guess

// let canvas = document.querySelector('main').appendChild(canvas);
// const canvas = document.querySelector('canvas');

// body.appendChild(canvas);
// document.querySelector('main').appendChild(canvas);
