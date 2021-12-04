const io = require('../index').io;
const wordList = require('../words.json');
const { pickRandomWords } = require('./utils');

io.on('connection', (socket) => {
  socket.on('gameStart', (data) => {
    console.log('game start', data);

    // destructure values from data
    const { customTags, customWordsOnly } = data;

    // make a copy of wordList to not manipulate the original
    let copyWordList = wordList;

    // check if customWordsonly boolean is checked
    customWordsOnly
      ? (copyWordList = customTags)
      : (copyWordList = copyWordList.concat(customTags));

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
      wordsToPick: pickRandomWords(copyWordList, 3),
      word: copyWordList[Math.floor(Math.random() * copyWordList.length)]
    });
  });
});
