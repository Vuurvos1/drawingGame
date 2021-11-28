import Fill from './canvasFill.js';

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
