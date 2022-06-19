import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

import { Server } from 'socket.io';
export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);

		// TODO extract these
		io.on('connection', (socket) => {
			console.log(`new client: ${socket.id}`);

			// console.log(socket);

			socket.on('join', async (room) => {
				socket.room = room; // TODO make sure this is a string
				socket.join(room);

				const sockets = await io.in(socket.room).fetchSockets();
				const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

				socket.in(socket.id).emit('join', socket.id);

				io.in(socket.room).emit('setUsers', users);
			});

			socket.on('chat', (message) => {
				// send message to all users in room
				socket.in(socket.room).emit('chat', message);
			});

			// once other user joins a room
			socket.on('joinRoom', async (user) => {
				// console.log(users);
				user.id = socket.id;
				socket.user = user;

				const sockets = await io.in(socket.room).fetchSockets();
				const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

				console.log('server join room', user);
				// console.log(socket.rooms);

				// validate user values
				io.in(socket.id).emit('setId', socket.id);
				io.in(socket.room).emit('setUsers', users);
			});

			socket.on('getUsers', async () => {
				const sockets = await io.in(socket.room).fetchSockets();
				const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

				io.in(socket.room).emit('setUsers', users);
			});

			socket.on('disconnect', () => {
				console.log('client disconnected');

				// emit leave event
				socket.in(socket.room).emit('leaveRoom', socket.id);
			});
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
