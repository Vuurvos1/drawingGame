const { io } = require('../index');
const { getGameRoom } = require('./utils');

io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
    socket.in(getGameRoom(socket)).emit('drawing', data);
  });

  socket.on('erase', (data) => {
    socket.in(getGameRoom(socket)).emit('erase', data);
  });

  socket.on('floodfill', (data) => {
    socket.in(getGameRoom(socket)).emit('floodfill', data);
  });
});

// old stuff
// socket.on('saveMove', (data) => {
//   socket.broadcast.emit('saveMove', data);
// });

// socket.on('undoMove', (data) => {
//   socket.broadcast.emit('undoMove', data);
// });

// send canvas to requested socket
// socket.on('sendCanvas', (data) => {
//   io.to(data.id).emit('recieveCanvas', data);
// });
