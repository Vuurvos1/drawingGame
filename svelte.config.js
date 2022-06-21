import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

import { Server } from 'socket.io';
import { socketEvents } from './server/socket.js';

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socketEvents(io, socket);
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
