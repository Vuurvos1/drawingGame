require('dotenv').config();
const express = require('express');
const app = express();

// Setup server
let server = app.listen(process.env.PORT || 3000, () => {
  // This call back just tells us that the server has started

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

  // console.log(socket);

  socket.on('joinRoom', (room) => {
    if (room) {
      // join existing room
      roomName = room;
      socket.join(room);
      const data = {
          id: socket.id,
          imageId: ~~(Math.random() * 7),
          you: false,
        };
        io.sockets.adapter.rooms[roomName].users.push(data);
        console.log(io.sockets.adapter.rooms[roomName]);
      // send to all other user
      socket.broadcast.emit('userJoin', data);
    } else {
      // if no room is specified
      console.log(socket.id);
      roomName = socket.id;
      socket.join(socket.id);
      socket.emit('roomValue', socket.id);
      const data = {
          id: socket.id,
          imageId: ~~(Math.random() * 7),
          you: true,
        };
        io.sockets.adapter.rooms[roomName].users = [data]
        socket.emit('roomUser', io.sockets.adapter.rooms)

      // update client user only
      socket.emit('userJoin', data);
    }
  });

  socket.on('message', (data) => {
    console.log(data.message);

    console.log(socket.users);

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

    // remove client form user list
    socket.to(roomName).emit('userLeave', data);
  });
});
