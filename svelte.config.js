import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

import { Server } from 'socket.io';
export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);

		// TODO extract these
		io.on('connection', (socket) => {
			socket.emit('serverEvent', 'hello world');
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
