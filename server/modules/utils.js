const crypto = require('crypto');

const generateId = (length = 8) => {
  return crypto.randomBytes(length).toString('hex');
};

const getGameRoom = (socket) => {
  // room 0 would be the same as the socket id
  return [...socket.rooms.values()][1];
};

const getUsers = (io, socket) => {
  const clients = io.sockets.adapter.rooms.get(getGameRoom(socket));

  let users = [];
  for (const clientId of clients) {
    const clientSocket = io.sockets.sockets.get(clientId);

    if (clientSocket.user) {
      users.push(clientSocket.user);
    }
  }

  return users;
};

const pickRandomWords = (words, count) => {
  // get 3 random words from the list
  const randomWords = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push(words[randomIndex]);
  }
  return randomWords;
};

module.exports = {
  generateId,
  getGameRoom,
  getUsers,
  pickRandomWords
};
