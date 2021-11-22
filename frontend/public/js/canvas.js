import Fill from './canvasFill.js';
import Paint from './canvasPaint.js';

const selectedCol = 'var(--highlight)';
const defeautlCol = 'white';

const canvasId = '#canvas';
const canvasEl = document.querySelector(canvasId);
const ctx = canvasEl.getContext('2d');
let lineWidth = 3;

const colorDisp = document.querySelector('.game .tools__color__display');

const paint = new Paint(canvasId, socket);
// set defealt tools
paint.activeTool = 'brush';
paint.lineWidth = 3;
paint.selectColor = '#000000';
// initialize paint
paint.init();

// hide game area after canvas is initialized
game.style.display = 'none';

// add eventListener to drawing tools
document.querySelectorAll('[data-tool]').forEach((item) => {
  if (item.getAttribute('data-tool') == 'brush') {
    item.style.backgroundColor = selectedCol;
  }

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

    // highlight selected tool
    document.querySelectorAll('[data-tool]').forEach((el) => {
      if (el == e.target) {
        e.target.style.backgroundColor = selectedCol;
      } else {
        el.style.backgroundColor = defeautlCol;
      }
    });
  });
});

// get existing canvas
socket.on('requestCanvas', (data) => {
  const savedData = canvasEl.toDataURL();
  const sendData = {
    id: data.id,
    imgData: savedData,
  };

  socket.emit('sendCanvas', sendData);
});

socket.on('recieveCanvas', (data) => {
  // this triggers multiple times when more users are in a lobby for some reason but works
  let img = new Image();
  img.src = data.imgData;

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
});

socket.on('floodFill', (data) => {
  new Fill(canvasEl, data.pos, data.col);
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
