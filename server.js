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

let roomName = '';

// WebSockets work with the HTTP server
let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`We have a new client: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    if (room) {
      roomName = room;
      socket.join(room);
      socket.broadcast.emit('userJoin', ~~(Math.random() * 7));
    } else {
      console.log(socket.id);
      roomName = socket.id;
      socket.join(socket.id);
      socket.emit('roomValue', socket.id);
    }
  });

  socket.on('message', (data) => {
    console.log(data.message);

    let data2 = {
      name: '🦐',
      message: data.message,
    };

    socket.to(roomName).emit('message', data2);
  });

  socket.on('disconnect', () => {
    console.log('Client has disconnected');
  });
});
