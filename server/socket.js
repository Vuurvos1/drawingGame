// TODO change this to be default?
export const socketEvents = (io, socket) => {
	console.log(`new client: ${socket.id}`);

	// join room
	socket.on('join', async (room) => {
		socket.room = room; // TODO make sure this is a string
		socket.join(room);

		const sockets = await io.in(socket.room).fetchSockets();
		const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

		// console.log(socket.rooms); // should never be more than 2?

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
		user.score = Math.floor(Math.random() * 2000);
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

	// game events
	socket.on('gameStart', (data) => {
		// randomize user order
		//
		// first user gets to pick word
		// see pick word event
	});

	socket.on('roundEnd', (data) => {
		// next user gets to pick word
		// basically game start without the shuffeling of users?
		// start a new timer
		// NOTE during round word needs to get less encrypted (send more letters to users)
		//
		// if this is the last round (last user in last round is finished):
		// transition to ending screen (show top 3 winners), also set a timer to transition back to lobby?
	});

	socket.on('pickWord', (data) => {
		// data is the index of the picked word [0-2]
		// send encrypted word to all users, send full word to current user
		// start the round timer
	});

	// canvas events
	socket.on('draw', (data) => {
		// TODO only emit if user can actually draw
		socket.in(socket.room).emit('draw', data);
	});

	socket.on('clearCanvas', (data) => {
		// TODO only emit if user can actually draw
		socket.in(socket.room).emit('clearCanvas', data);
	});

	socket.on('floodfill', (data) => {
		// data: { x, y, color }
		// TODO only emit if user can actually draw
		socket.in(socket.room).emit('floodfill', data);
	});

	// getCanvas, event for new users to get current drawing
	// server should have its own virtual canvas as the "truth"?

	// TODO undo and redo events

	socket.on('disconnect', () => {
		console.log(`client disconnected: ${socket.id}`);

		// if user is host of game

		// if 2nd to last user, end game > back to lobby

		// if last user, cancel game, destroy room

		// emit leave event
		socket.in(socket.room).emit('leaveRoom', socket.id);
	});
};
