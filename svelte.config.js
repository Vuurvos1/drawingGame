import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

import { Server } from 'socket.io';
export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);

		// TODO extract these
		io.on('connection', (socket) => {
			// console.log(`New client: ${socket.id}`);

			socket.on('join', (room) => {
				socket.room = room; // TODO make sure this is a string
				socket.join(room);
			});

			socket.on('chat', (message) => {
				// send message to all users in room
				socket.in(socket.room).emit('chat', message);
			});

			socket.on('disconnect', () => {});
		});
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [webSocketServer]
		}
	}
};

export default config;
