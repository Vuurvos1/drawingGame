const crypto = require('crypto');

module.exports.generateId = function (length = 8) {
  return crypto.randomBytes(length).toString('hex');
};

module.exports.getGameRoom = function (socket) {
  // room 0 would be the same as the socket id
  return [...socket.rooms.values()][1];
};
