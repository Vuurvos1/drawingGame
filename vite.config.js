import { sveltekit } from '@sveltejs/kit/vite';
import removeConsole from 'vite-plugin-svelte-console-remover';

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
			// not 100% if this actually restarts the web socket server
			console.log('Restarting server...');

			server.ws.send({
				type: 'full-reload',
				path: '*'
			});
		}
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [webSocketServer, sveltekit(), removeConsole()]
};

export default config;
