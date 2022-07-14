import { randomInts, getJsonWords } from './utils.js';

// TODO change this to be default?
export const socketEvents = async (io, socket) => {
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
		// console.log(data);
		let { user, room } = data;

		// console.log(user, room);

		// and not already in another room
		if (!room || room == '') {
			console.log('random room');
			const random = (Math.random() + 1).toString(36).substring(7);
			room = random;

			// send room back to user?
		}

		// console.log(io.sockets.adapter.rooms);
		// console.log(io.sockets.adapter.rooms.get('room-' + room));

		// 	// validate room value
		// 	socket.room = room;
		// 	socket.join(room);

		// 	// send room code back to client
		// } else {
		// 	//
		// }

		if (!io.sockets.adapter.rooms.get('room-' + room)) {
			console.log('creating new room');

			socket.join('room-' + room);

			let serverRoom = io.sockets.adapter.rooms.get('room-' + room);

			// serverRoom.host = socket.id;

			const defaults = {
				host: socket.id, // id of room hsot
				currPlayer: 0, // current player
				currRound: 0, // current round
				currWord: '', // current word beeing guesed
				words: [], // array with words user can pick from
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

			// send current host to clients
			socket.emit('setHost');
		} else {
			// room already exists
			// if already in room, update user, otherwise join room
			socket.join('room-' + room);
			console.log('joining existing room');

			// send canvas to user if game already started

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
		data.text = data.text.trim(); // format message
		// TODO further/better format message?

		if (data.text == '') return; // don't send empty messages

		// send message to all users in room
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
		// check if host started the game

		// get users
		const sockets = await io.in(socket.room).fetchSockets();
		const usersIds = sockets.filter((s) => s.user !== undefined).map((s) => s.id);

		// randomize user order
		const shuffeledUsers = usersIds.sort((u) => 0.5 - Math.random()); // randomize user list (broken?, also seems to be biased)
		// console.log(usersIds, shuffeledUsers);
		// set user order

		// get server room
		const room = socket.room;
		const serverRoom = io.sockets.adapter.rooms.get('room-' + room);

		// first user gets to pick word
		// see pick word event
		// set values

		const jsonWords = await getJsonWords();

		const indexes = randomInts(3, jsonWords.length); // generate 3 random indexes for word array
		const words = indexes.map((index) => jsonWords[index]); // get indexes from word array
		// send words to first user
		io.in(shuffeledUsers[0]).emit('pickWord', words); // send words to user (io.in to also send to self)
		serverRoom.words = words;

		socket.in(socket.room).emit('gameStart', '');
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

	socket.on('pickWord', (index) => {
		// data is the index of the picked word [0-2]
		const room = socket.room;
		const serverRoom = io.sockets.adapter.rooms.get('room-' + room);

		if (serverRoom.words.length < 1) return; // no words to pick from

		// index/data validation
		if (typeof index !== 'number' && index >= 0 && index < serverRoom.words.length) {
			index = Math.floor(Math.random() * 3); // pick random word index if not valid
		}

		serverRoom.currWord = serverRoom.words[index]; // set current word
		serverRoom.words = []; // clear server word selection

		console.log('user picked:', serverRoom.currWord);

		// send encrypted word to all users, send full word to current user
		// start the round timer

		// setTimeout()
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
