import { error } from '@sveltejs/kit';

export function load() {
	const roomName = (Math.random() + 1).toString(36).substring(7);

	// TODO check if room already exists

	if (!roomName) {
		throw error(400, 'Something went wrong creating a room');
	}

	return { roomName };
}
