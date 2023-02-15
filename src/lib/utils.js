import { onDestroy } from 'svelte';

export function throttle(callback, delay) {
	let previousCall = new Date().getTime();
	return function () {
		let time = new Date().getTime();

		if (time - previousCall >= delay) {
			previousCall = time;
			callback.apply(null, arguments);
		}
	};
}

export const hexToRgba = (hex, alpha = 255) => {
	const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
	return [r, g, b, alpha];
};

export function onInterval(callback, milliseconds) {
	const interval = setInterval(callback, milliseconds);

	onDestroy(() => {
		clearInterval(interval);
	});
}

/**
 * Test if a string is valid JSON
 *
 * @param {string} str - string
 * @return {boolean} If string is valid json
 */
export function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export function randomString(length = 7) {
	// random string containing numbers and letters
	return (Math.random() + 1).toString(36).substring(length);
}
