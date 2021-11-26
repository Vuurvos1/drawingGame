const io = require('../index').io;

io.on('connection', (socket) => {
  socket.on('gameStart', (data) => {
    console.log('game start', data);

    const room = io.sockets.adapter.rooms.get(socket.roomId);

    room.gameManager.time = 30; // get this from data

    // maybe move the timer clientside and only send an end signal
    room.gameManager.timerId = setInterval(() => {
      room.gameManager.time -= 1;

      if (room.gameManager.time < 0) {
        // stop time
        clearInterval(room.gameManager.timerId);
        return;
      }

      io.in(socket.roomId).emit('timer', room.gameManager.time);
    }, 1000);

    // update timer

    // start timer
    io.in(socket.roomId).emit('gameStart', {
      time: 30,
      rounds: 3,
      word: '',
    });
  });
});
