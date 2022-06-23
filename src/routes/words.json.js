import words from '$lib/words.json';

export const get = async () => {
	return {
		body: words
	};
};
