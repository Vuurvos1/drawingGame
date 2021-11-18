const io = require('../index').io;

io.on('connection', (socket) => {
  socket.on('chat', (data) => {
    socket.broadcast.emit('chat', data);
  });

  socket.on('joinRoom', () => {});
});
