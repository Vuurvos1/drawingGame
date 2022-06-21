// TODO change this to be default?
export const socketEvents = (io, socket) => {
	console.log(`new client: ${socket.id}`);

	// join room
	socket.on('join', async (room) => {
		socket.room = room; // TODO make sure this is a string
		socket.join(room);

		const sockets = await io.in(socket.room).fetchSockets();
		const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

		// console.log(socket.rooms); // should never be longer than 2

		io.in(socket.room).emit('setUsers', users);
	});

	socket.on('chat', (message) => {
		// send message to all users in room

		// only check this if in game
		// if (message === word) {
		// base score on time left and amount of people that already guessed
		// 	socket.user.score += 100;
		// }

		socket.in(socket.room).emit('chat', message);
	});

	// once other user joins a room
	socket.on('joinRoom', async (user) => {
		user.id = socket.id;
		socket.user = user;

		const sockets = await io.in(socket.room).fetchSockets();
		const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

		// TODO validate user values
		io.in(socket.id).emit('setUser', socket.user);
		io.in(socket.room).emit('setUsers', users);
	});

	socket.on('getUsers', async () => {
		const sockets = await io.in(socket.room).fetchSockets();
		const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

		io.in(socket.room).emit('setUsers', users);
	});

	socket.on('disconnect', () => {
		console.log(`client disconnected: ${socket.id}`);

		// emit leave event
		socket.in(socket.room).emit('leaveRoom', socket.id);
	});
};
