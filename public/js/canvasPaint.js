import getMouseCoordsOnCanvas from './canvasUtility.js';
import Tool from './canvasTools.js';
import Fill from './canvasFill.js';

export default class Paint {
  constructor(canvasId) {
    this.canvas = document.querySelector(canvasId);
    this.ctx = canvas.getContext('2d');

    this.undoStack = [];
    this.undoLimit = 3; // max 3 undo moves
  }

  set activeTool(tool) {
    this.tool = tool;
  }

  set lineWidth(lineWidth) {
    // _ to prevent conflict
    this._lineWidth = lineWidth;
    this.ctx.lineWidth = this._lineWidth;
  }

  set selectColor(col) {
    this.color = col;
    this.ctx.strokeStyle = this.color;
  }

  init() {
    this.canvas.onmousedown = (e) => this.onMouseDown(e);

    // ensure right canvas scale (width and height)
    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;
  }

  onMouseDown(e) {
    this.savedData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );

    if (this.undoStack.length >= this.undoLimit) {
      this.undoStack.shift();
    }
    this.undoStack.push(this.savedData);

    this.canvas.onmousemove = (e) => this.onMouseMove(e);
    document.onmouseup = (e) => this.onMouseUp(e);

    this.startPos = getMouseCoordsOnCanvas(this.canvas, e);
    console.log(this.startPos);

    if (this.tool == Tool.TOOL_BRUSH) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startPos.x, this.startPos.y);
    } else if (this.tool == Tool.TOOL_BUCKET) {
      new Fill(this.canvas, this.startPos, this.color);
    } else if (this.tool == Tool.TOOL_ERASER) {
      this.ctx.clearRect(
        this.startPos.x,
        this.startPos.y,
        this._lineWidth,
        this._lineWidth
      );
    }
  }

  onMouseMove(e) {
    this.currentPos = getMouseCoordsOnCanvas(this.canvas, e);

    switch (this.tool) {
      case Tool.TOOL_BRUSH:
        this.drawFreeLine(this._lineWidth);
        break;
      case Tool.TOOL_BUCKET:
        break;
      case Tool.TOOL_ERASER:
        this.ctx.clearRect(
          this.currentPos.x,
          this.currentPos.y,
          this._lineWidth,
          this._lineWidth
        );
        break;
    }
  }

  onMouseUp(e) {
    this.canvas.onmousemove = null;
    document.onmouseup = null;
  }

  drawFreeLine(lineWidth) {
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
    this.ctx.stroke();
  }

  undoMove() {
    if (this.undoStack.length > 0) {
      this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
      this.undoStack.pop();
    } else {
      // no undos availible
    }
  }
}
