import { hexToRgba } from '../utils';

// TODO optimize call stack so page doesn't crash?
export function floodfill(ctx, x, y, fillColor, range = 1) {
	fillColor = hexToRgba(fillColor, 255);

	// read the pixels in the canvas
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	// flags for if we visited a pixel already
	const visited = new Uint8Array(imageData.width, imageData.height);
	// get the color we're filling
	const targetColor = getPixel(imageData, x, y);
	let fillsStack = [];
	// check we are actually filling a different color
	// get pixels
	if (!colorsMatch(targetColor, fillColor)) {
		const rangeSq = range * range;
		const pixelsToCheck = [x, y];
		while (pixelsToCheck.length > 0) {
			const y = pixelsToCheck.pop();
			const x = pixelsToCheck.pop();
			const currentColor = getPixel(imageData, x, y);
			if (!visited[y * imageData.width + x] && colorsMatch(currentColor, targetColor, rangeSq)) {
				setPixel(imageData, x, y, fillColor);
				visited[y * imageData.width + x] = 1; // mark we were here already
				pixelsToCheck.push(x + 1, y);
				pixelsToCheck.push(x - 1, y);
				pixelsToCheck.push(x, y + 1);
				pixelsToCheck.push(x, y - 1);
			}
		}
		// fill pixels
		if (fillsStack.length > 0) {
			const stackLength = fillsStack.length;
			for (let i = 0; i < stackLength; i++) {}
		} else {
			ctx.putImageData(imageData, 0, 0);
			fillsStack = [];
		}
		// put the data back
		ctx.putImageData(imageData, 0, 0);
	}
}

export function setPixel(imageData, x, y, color) {
	const offset = (y * imageData.width + x) * 4;
	imageData.data[offset + 0] = color[0];
	imageData.data[offset + 1] = color[1];
	imageData.data[offset + 2] = color[2];
	imageData.data[offset + 3] = color[3];
}

export function colorsMatch(a, b, rangeSq) {
	const dr = a[0] - b[0];
	const dg = a[1] - b[1];
	const db = a[2] - b[2];
	const da = a[3] - b[3]; // technically don't need to check this
	return dr * dr + dg * dg + db * db + da * da < rangeSq;
}

// TODO optimize call stack so page doesn't crash?
// TODO make this thing async?
export function floodfill2(ctx, x, y, fillColor) {
	// read the pixels in the canvas
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	// make a Uint32Array view on the pixels so we can manipulate pixels
	// one 32bit value at a time instead of as 4 bytes per pixel
	const pixelData = {
		width: imageData.width,
		height: imageData.height,
		data: new Uint32Array(imageData.data.buffer)
	};

	// flags for if we visited a pixel already
	const visited = new Uint8Array(pixelData.width, pixelData.height);
	// get the color we're filling
	const targetColor = getPixel(imageData, x, y);
	const currentCol = hexToRgba(fillColor, 255);

	// convert the fillColor to a Uint32 to set 4 values at once
	ctx.fillStyle = fillColor;
	ctx.fillRect(x, y, x + 1, y + 1);
	const imgData = ctx.getImageData(x, y, x + 1, y + 1);
	fillColor = new Uint32Array(imgData.data.buffer)[0];

	// check we are actually filling a different color
	let i = 0;

	// if (!matchRGBA(currentCol, targetColor, 1)) {
	if (currentCol !== fillColor) {
		// const rangeSq = range * range;
		const pixelsToCheck = [x, y];
		while (pixelsToCheck.length > 0 || i < 10) {
			const y = pixelsToCheck.pop();
			const x = pixelsToCheck.pop();

			const currentColor = getPixelHex(pixelData, x, y);

			// const currentColor = getPixel(imageData, x, y);
			// if (!visited[y * imageData.width + x] && matchRGBA(currentColor, targetColor, rangeSq)) {

			// console.log(fillColor, currentColor);

			if (!visited[y * imageData.width + x] && currentColor > -1 && currentColor !== fillColor) {
				pixelData.data[y * pixelData.width + x] = fillColor;

				visited[y * imageData.width + x] = 1; // mark we were here already

				pixelsToCheck.push(x + 1, y);
				pixelsToCheck.push(x - 1, y);
				pixelsToCheck.push(x, y + 1);
				pixelsToCheck.push(x, y - 1);
				i++;
			}
		}

		// put the data back
		ctx.putImageData(imageData, 0, 0);
	}
}

export function getPixel(imageData, x, y) {
	if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
		return [-1, -1, -1, -1]; // impossible color
	} else {
		const offset = (y * imageData.width + x) * 4;
		return imageData.data.slice(offset, offset + 4);
	}
}

export function matchRGBA(a, b, rangeSq) {
	const dr = a[0] - b[0];
	const dg = a[1] - b[1];
	const db = a[2] - b[2];
	const da = a[3] - b[3]; // technically don't need to check this
	return dr * dr + dg * dg + db * db + da * da < rangeSq;
}

function getPixelHex(pixelData, x, y) {
	if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
		return -1; // impossible color
	} else {
		return pixelData.data[y * pixelData.width + x];
	}
}
