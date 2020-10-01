import Point from './canvasPointModel.js';

export default function getMouseCoordsOnCanvas(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x: x, y: y };
}
