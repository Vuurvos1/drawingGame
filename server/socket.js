// TODO change this to be default?
export const socketEvents = (io, socket) => {
	console.log(`new client: ${socket.id}`);

	// console.log('adapter', io);

	// get all sockets inside a room
	// io.sockets.adapter.rooms['roomName'].sockets

	// join room
	// this could later be removed in favour for the joinRoom event
	socket.on('join', async (room) => {
		socket.room = room; // TODO make sure this is a string
		socket.join(room);

		const sockets = await io.in(socket.room).fetchSockets();
		const users = sockets.filter((s) => s.user !== undefined).map((s) => s.user);

		// log which rooms socket currently is in
		// console.log(socket.rooms); // should never be more than 2?

		io.in(socket.room).emit('setUsers', users);
	});

	// once other user joins a room
	socket.on('joinRoom', async (data) => {
		console.log(data);
		let { user, room } = data;

		// // and not already in another room
		if (!room || room !== '') {
			let random = (Math.random() + 1).toString(36).substring(7);
			room = random;
		}

		// console.log(io.sockets.adapter.rooms['room-' + room]);
		// console.log(io.sockets.adapter.rooms.get('room-' + room));

		// 	// validate room value
		// 	socket.room = room;
		// 	socket.join(room);

		// 	// send room code back to client
		// } else {
		// 	//
		// }

		if (!io.sockets.adapter.rooms['room-' + room]) {
			console.log('creating new room');

			socket.join('room-' + room);

			let serverRoom = io.sockets.adapter.rooms.get('room-' + room);

			// serverRoom.host = socket.id;

			const defaults = {
				host: socket.id, // id of room hsot
				currPlayer: 0, // current player
				currRound: 0, // current round
				currWord: '', // current word beeing guesed
				gaming: false, // if gaming/ playing rounds
				settings: {
					// default/empty room settings
					rounds: 3,
					duration: 30,
					userOrder: [],
					customWords: [],
					customWordsOnly: false
				}
			};
			// add array to keep track of players?
			// room time
			// canvas?

			// set default room values
			Object.assign(serverRoom, defaults);

			console.log(serverRoom, io.sockets.adapter.rooms.get('room-' + room));

			// send current host to clients
			socket.emit('setHost');
		} else {
			// room already exists
			// if already in room, update user, otherwise join room
			socket.join('room-' + room);
			console.log('joining existing room');

			// TODO add logic for when a user accidently disconnected from a game
			// This could be done by checking if the saved user id is on the leaderboard, and not already in the room
			// else create new user
		}

		// let _room = io.sockets.adapter.rooms[room];
		// _room.host = socket.id;

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

	socket.on('chat', (data) => {
		// format message
		data.text = data.text.trim();

		console.log('chat', data);
		if (data.text == '') return;

		// send message to all users in room

		// TODO format message

		const serverRoom = io.sockets.adapter.rooms.get('room-' + socket.room);

		// only check this if in game
		if (data.text === serverRoom?.currWord) {
			// base score on time left and amount of people that already guessed
			socket.user.score += 100;
			// update users
		} else {
			socket.in(socket.room).emit('chat', data);
		}
	});

	// game events
	socket.on('gameStart', async (data) => {
		// check if game already started

		// get users
		const sockets = await io.in(socket.room).fetchSockets();
		const usersIds = sockets.filter((s) => s.user !== undefined).map((s) => s.id);

		const shuffeledUsers = usersIds.filer((u) => 0.5 - Math.random());
		console.log(usersIds, shuffeledUsers);

		// set user order

		// randomize user order
		//
		// first user gets to pick word
		// see pick word event
		// set values
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

	socket.on('getHostData', () => {
		// get data from host socket
		// and send data from host socket to users in room
	});

	socket.on('disconnect', () => {
		console.log(`client disconnected: ${socket.id}`);

		const room = socket.room;

		const serverRoom = io.sockets.adapter.rooms.get('room-' + room);

		if (serverRoom?.host === socket.id) {
			// TODO pick new host
			socket.emit('setHost');

			// if no new host availible, destroy room?
		}

		// if user is host of game

		// if 2nd to last user, end game > back to lobby

		// if last user, cancel game, destroy room

		// emit leave event
		socket.in(socket.room).emit('leaveRoom', socket.id);
	});
};
