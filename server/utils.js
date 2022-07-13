// TODO jsdoc this
// generate different random numbers in a range from [0, x)
// amount: of numbers to be generated
// maxValue: maximum random value
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
