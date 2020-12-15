const io = require('../server.js').io;

io.on('connection', (socket) => {
  // canvas events
  socket.on('startStoke', (data) => {
    // console.log('startStroke');
    // console.log(data);

    socket.broadcast.emit('startStroke', data);
  });

  socket.on('floodFill', (data) => {
    // console.log('floodFill');
    // console.log(data);

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
});
