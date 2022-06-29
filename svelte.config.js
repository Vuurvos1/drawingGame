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
	},
	handleHotUpdate({ file, server }) {
		if (file.includes('/server/')) {
			console.log('Restarting server...');

			server.ws.send({
				type: 'full-reload',
				path: '*'
			});
		}
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
