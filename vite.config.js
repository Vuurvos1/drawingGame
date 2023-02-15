import { sveltekit } from '@sveltejs/kit/vite';
import removeConsole from 'vite-plugin-svelte-console-remover';

import { Server } from 'socket.io';
let socketEvents;

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer: async (server) => {
		// if no socket events import for the first time
		if (!socketEvents) {
			const events = await import(`./server/socket.js?version=${Number(new Date())}`);
			socketEvents = events.socketEvents;
		}

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			socketEvents(io, socket);
		});
	},
	handleHotUpdate: async ({ file, server }) => {
		// if a file changes in server directory
		if (file.includes('/server/')) {
			console.log('Server change');

			// reimport socket events with version to get around caching
			const events = await import(`./server/socket.js?version=${Number(new Date())}`);
			socketEvents = events.socketEvents;

			// reload client
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
