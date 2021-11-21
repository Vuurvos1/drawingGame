const io = require('../index').io;
const { generateId, getGameRoom } = require('./utils');

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    data = data.trim();
    if (data) {
      socket.join(data);
    } else {
      const id = generateId(8);
      console.log('joined ', id);
      socket.join(id);
    }
  });

  // send link

  socket.on('chat', (data) => {
    socket.in(getGameRoom(socket)).emit('chat', data);

    // TODO check against picked word in game
  });
});
