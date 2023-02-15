import { readFile } from 'fs/promises';
import crypto from 'node:crypto';

/**
 * Generate a random id
 *
 * @param {number} [length=8] - Length of id
 * @return {string} Random id
 */
export function generateId(length = 8) {
	return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate different random numbers in a range from [0, maxValue)
 *
 * @param {number} amount - Amount of numbers to be generated
 * @param {number} [maxValue=15] - Maximum random value
 * @return {number[]} Array containing random unique indexes
 */
export function randomInts(amount = 3, maxValue = 15) {
	if (amount >= maxValue) {
		console.log('To many values requested');
		return [];
	}

	const set = new Set();
	while (set.size < amount) {
		set.add(Math.floor(Math.random() * maxValue));
	}

	return [...set]; // convert set to array
}

// export this value instead?
let jsonWords;
export async function getJsonWords() {
	if (!jsonWords) {
		const json = JSON.parse(await readFile(new URL('../src/lib/words.json', import.meta.url)));
		jsonWords = json;
	}

	return jsonWords;
}
