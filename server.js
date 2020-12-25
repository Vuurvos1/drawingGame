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
exports.io = io;

// io modules
require('./modules/canvas');

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

    // console.log(roomName, socket.id, roomName == socket.id);

    // request canvas for new users
    if (socket.id != roomName) {
      // change this to be user 0 / host in the room
      io.to(roomName).emit('requestCanvas', { id: socket.id });
    }
  });

  socket.on('message', (data) => {
    // check word logic
    if (
      data.message.toLowerCase() ===
      io.sockets.adapter.rooms[roomName].word.toLowerCase()
    ) {
      // send to other clients
      // close state
      // correct state
      // --> update scores
    }

    // send chat message
    const res = {
      name: io.sockets.adapter.rooms[roomName].users[data.id].username,
      message: data.message
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
    };

    socket.to(roomName).emit('message', res);
  });

  socket.on('startGame', (data) => {
    console.log('startgame');
    // select random move order

    const userIdArr = Object.keys(io.sockets.adapter.rooms[roomName].users);
    const userOrder = userIdArr.sort(() => 0.5 - Math.random());
    io.sockets.adapter.rooms[roomName].userOrder = userOrder;

    // socket.broadcast.emit('startGame', data);
    io.in(roomName).emit('startGame', data);

    // temp code
    const array = require('./words/words.json');

    io.sockets.adapter.rooms[roomName].currentMove = userOrder[0];

    io.to(userOrder[0]).emit(
      'test',
      array.words.sort(() => 0.5 - Math.random()).slice(0, 3)
    );
  });

  socket.on('updateUsername', (data) => {
    io.sockets.adapter.rooms[roomName].users[data.id].username = data.username;

    const temp = Object.values(io.sockets.adapter.rooms[roomName].users);
    console.log(io.sockets.adapter.rooms[roomName].users);

    io.in(roomName).emit('userJoin', temp);
  });

  // socket.on('getWords', () => {
  //   const array = require('./words/words.json');
  //   socket.emit('getWords', array.sort(() => 0.5 - Math.random()).slice(0, 3));
  // });

  socket.on('pickWord', (word) => {
    console.log(word);
    // set room word
    io.sockets.adapter.rooms[roomName].word = word;
  });

  socket.on('nextTurn', (data) => {
    console.log('next turn');

    const userOrder = io.sockets.adapter.rooms[roomName].userOrder;
    const currentPlayer = io.sockets.adapter.rooms[roomName].currentMove;

    let index = userOrder.indexOf(currentPlayer);
    // add one to index for next player
    // index +2 since you start counting at 0 and add 1
    if (index + 2 > userOrder.length) {
      index = 0;
      // round++
    } else {
      index++;
    }

    const nextPlayer = userOrder[index];
    io.sockets.adapter.rooms[roomName].currentMove = nextPlayer;

    const array = require('./words/words.json');

    io.to(nextPlayer).emit(
      'test',
      array.words.sort(() => 0.5 - Math.random()).slice(0, 3)
    );
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
