const io = require('../index').io;

io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('erase', (data) => {
    socket.broadcast.emit('erase', data);
  });

  socket.on('floodfill', (data) => {
    socket.broadcast.emit('floodfill', data);
  });
});

// old stuff

//   socket.on('saveMove', (data) => {
//     socket.broadcast.emit('saveMove', data);
//   });

//   socket.on('undoMove', (data) => {
//     socket.broadcast.emit('undoMove', data);
//   });

//   // send canvas to requested socket
//   socket.on('sendCanvas', (data) => {
//     io.to(data.id).emit('recieveCanvas', data);
//   });
