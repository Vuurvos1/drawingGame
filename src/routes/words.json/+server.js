import words from '$lib/words.json';
const jsonWords = JSON.stringify(words);

export function GET() {
	return new Response(jsonWords);
}
