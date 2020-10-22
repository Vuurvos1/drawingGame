require('dotenv').config();
const express = require('express');
const app = express();

// Setup server
let server = app.listen(process.env.PORT || 3000, () => {
  // let host = server.address().address;
  const port = server.address().port;
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static('public'));

// WebSockets work with the HTTP server
let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`We have a new client: ${socket.id}`);
  let roomName = '';

  socket.on('joinRoom', (room) => {
    const data = {
      id: socket.id,
      imageId: ~~(Math.random() * 7),
      username: ~~(Math.random() * 7),
    };

    roomName = room ? `${room}` : `${socket.id}`;
    socket.join(roomName);

    if (io.sockets.adapter.rooms[roomName].users) {
      // room already exists
      io.sockets.adapter.rooms[roomName].users[socket.id] = data;
      io.sockets.adapter.rooms[roomName].users[socket.id].host = false;
    } else {
      // new room
      io.sockets.adapter.rooms[roomName].users = {};
      io.sockets.adapter.rooms[roomName].users[socket.id] = data;
      io.sockets.adapter.rooms[roomName].users[socket.id].host = true;
    }

    console.log(io.sockets.adapter.rooms[roomName]);

    // send room share link to client
    socket.emit('roomValue', roomName);

    // update all clients user list
    const temp = Object.values(io.sockets.adapter.rooms[roomName].users);
    io.in(roomName).emit('userJoin', temp);

    console.log(roomName, socket.id, roomName == socket.id);

    // request canvas for new users
    if (socket.id != roomName) {
      // change this to be user 0 / host in the room
      io.to(roomName).emit('requestCanvas', { id: socket.id });
    }
  });

  socket.on('message', (data) => {
    const res = {
      name: io.sockets.adapter.rooms[roomName].users[data.id].username,
      message: data.message.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;'),
    };

    socket.to(roomName).emit('message', res);
  });

  socket.on('startGame', (data) => {
    console.log('startgame');
    // socket.broadcast.emit('startGame', data);
    io.in(roomName).emit('startGame', data);
  });

  // canvas events
  socket.on('startStoke', (data) => {
    console.log('startStroke');
    console.log(data);

    socket.broadcast.emit('startStroke', data);
  });

  socket.on('floodFill', (data) => {
    console.log('floodFill');
    console.log(data);

    socket.broadcast.emit('floodFill', data);
  });

  socket.on('drawStroke', (data) => {
    socket.broadcast.emit('drawStroke', data);
  });

  socket.on('changeColor', (data) => {
    socket.broadcast.emit('changeColor', data);
  });

  socket.on('changeLineWidth', (data) => {
    socket.broadcast.emit('changeLineWidth', data);
  });

  socket.on('saveMove', (data) => {
    socket.broadcast.emit('saveMove', data);
  });

  socket.on('undoMove', (data) => {
    socket.broadcast.emit('undoMove', data);
  });

  socket.on('erase', (data) => {
    socket.broadcast.emit('erase', data);
  });

  // send canvas to requested socket
  socket.on('sendCanvas', (data) => {
    io.to(data.id).emit('recieveCanvas', data);
  });

  socket.on('updateUsername', (data) => {
    io.sockets.adapter.rooms[roomName].users[data.id].username = data.username;

    const temp = Object.values(io.sockets.adapter.rooms[roomName].users);
    console.log(io.sockets.adapter.rooms[roomName].users);

    io.in(roomName).emit('userJoin', temp);
  });

  // socket leave logic
  socket.on('disconnect', () => {
    console.log('Client has disconnected');

    const data = {
      id: socket.id,
    };

    if (io.sockets.adapter.rooms[roomName]) {
      const roomUsers = io.sockets.adapter.rooms[roomName].users;

      // remove user from object
      if (io.sockets.adapter.rooms[roomName]) {
        delete roomUsers[socket.id];

        // update host
        const newHostId = roomUsers[Object.keys(roomUsers)[0]];
        console.log(newHostId);

        roomUsers[newHostId.id].host = true;
      }

      // remove client form user list
      socket.to(roomName).emit('userLeave', data);
    }
  });
});
