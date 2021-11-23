const io = require('../index').io;
const { generateId, getGameRoom, getUsers } = require('./utils');

// TODO figure out some of the event naming
io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    data = data.trim();
    if (data) {
      socket.join(data);
      socket.emit('roomCode', data);
    } else {
      const id = generateId(8); // TODO check if id doesn't already exsist
      socket.join(id);
      socket.emit('roomCode', id);
    }
  });

  socket.on('setUser', (data) => {
    // set custom user data
  });

  // get all users in a room
  socket.on('getUsers', (data) => {});

  // join lobby and set user data
  socket.on('joinLobby', (data) => {
    // expand this object with more user specific data
    socket.user = {
      username: data.username,
    };

    const users = getUsers(io, socket);
    io.in(getGameRoom(socket)).emit('setUsers', users);
  });

  // send link

  socket.on('chat', (data) => {
    socket.in(getGameRoom(socket)).emit('chat', data);

    // TODO check against picked word in game
  });
});
