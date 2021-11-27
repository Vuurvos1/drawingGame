const io = require('../index').io;
const { generateId, getGameRoom, getUsers } = require('./utils');

// TODO figure out some of the event naming
io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    data = data.trim();
    const id = data ? data : generateId(8); // TODO check if id doesn't already exsist

    socket.join(id);
    socket.emit('roomCode', id);
    socket.roomId = id;

    let room = io.sockets.adapter.rooms.get(id);
    room.gameManager = { id: '', timer: 0 };
    // console.log(room.gameManager);
  });

  // get all users in a room
  // socket.on('getUsers', (data) => {});

  // join lobby and set user data
  socket.on('joinLobby', (data) => {
    // expand this object with more user specific data
    socket.user = {
      username: data.username,
      points: 0, // TODO correct points if user was disconected
    };

    const users = getUsers(io, socket);
    io.in(getGameRoom(socket)).emit('setUsers', users);
  });

  // send link

  socket.on('chat', (data) => {
    // TODO add username to data

    socket.in(getGameRoom(socket)).emit('chat', data);

    // TODO check against picked word in game
  });
});
