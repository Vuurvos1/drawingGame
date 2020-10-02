import Point from './canvasPointModel.js';

export default function getMouseCoordsOnCanvas(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  // console.log(e.clientX);
  // console.log(rect);
  // console.log(e.pageX);
  // console.log(e.pageY);
  // console.log(e.clientX);
  // console.log(e.clientY);
  const x = Math.round(e.clientX - rect.left);
  // const x = Math.round(e.pageX - rect.left);
  const y = Math.round(e.clientY - rect.top);
  // const y = Math.round(e.pageY - rect.top);
  // const x = Math.round(e.pageX - this.offsetLeft);
  // const y = Math.round(e.pageY - this.offsetTop);
  return { x: x, y: y };
}
