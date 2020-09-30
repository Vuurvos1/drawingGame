require('dotenv').config();
const express = require('express');
const app = express();

// Setup server
let server = app.listen(process.env.PORT || 3000, () => {
  // let host = server.address().address;
  let port = server.address().port;
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
      you: false,
    };
    // you: true,

    roomName = room ? `${room}` : `${socket.id}`;
    socket.join(roomName);

    if (io.sockets.adapter.rooms[roomName].users) {
      io.sockets.adapter.rooms[roomName].users.push(data);
    } else {
      io.sockets.adapter.rooms[roomName].users = [data];
    }

    // send room share link to client
    // problem when sharing the link when already in a room (adds socket id)
    socket.emit('roomValue', socket.id);

    // update all clients user list
    io.in(roomName).emit('userJoin', io.sockets.adapter.rooms[roomName].users);
  });

  socket.on('message', (data) => {
    console.log(data.message);

    const data2 = {
      name: '🦐',
      message: data.message,
    };

    socket.to(roomName).emit('message', data2);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected');

    const data = {
      id: socket.id,
    };

    const usersArr = io.sockets.adapter.rooms[roomName];

    // remove user from array
    if (usersArr) {
      for (let i = 0; i < usersArr.users.length; i++) {
        if (usersArr.users[i].id == socket.id) {
          io.sockets.adapter.rooms[roomName].users.splice(i, 1);
        }
      }
    }

    // remove client form user list
    socket.to(roomName).emit('userLeave', data);
  });
});
