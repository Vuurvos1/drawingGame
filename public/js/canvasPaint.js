import getMouseCoordsOnCanvas from './canvasUtility.js';
import Tool from './canvasTools.js';

export default class Paint {
  constructor(canvasId) {
    this.canvas = document.querySelector(canvasId);
    this.ctx = canvas.getContext('2d');
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
  }

  onMouseDown(e) {
    this.canvas.onmousemove = (e) => this.onMouseMove(e);
    document.onmouseup = (e) => this.onMouseUp(e);

    this.startPos = getMouseCoordsOnCanvas(this.canvas, e);
    console.log(this.startPos);

    if ((this.tool = Tool.TOOL_BRUSH)) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startPos.x, this.startPos.y);
    }
  }

  onMouseMove(e) {
    this.currentPos = getMouseCoordsOnCanvas(this.canvas, e);
    console.log(this.currentPos);

    switch (this.tool) {
      case Tool.TOOL_BRUSH:
        this.drawFreeLine(this._lineWidth);
        break;
      case Tool.TOOL_BUCKET:
        break;
      case Tool.TOOL_ERASER:
        break;

      default:
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
}
