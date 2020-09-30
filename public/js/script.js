let socket = io.connect(window.location.host);

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

const roomTxt = document.querySelector('.roomCode__Text');
const roomSend = document.querySelector('#room button');

const msgTxt = document.querySelector('#send input[type=text]');
const msgSend = document.querySelector('#send button');

const playerGrid = document.querySelector('.players .players__grid');

// Incomming
socket.on('message', (data) => {
  console.log(data);
});

socket.on('roomValue', (data) => {
  roomTxt.value = `${window.location.href}?${data}`;
});

socket.on('roomUser', (data) => {
  console.log(data);
});

// Outgoing
msgSend.addEventListener('click', () => {
  console.log('text msg send');
  let data = {
    message: msgTxt.value,
  };

  socket.emit('message', data);
});

// when DOM is laoded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');
  socket.emit('joinRoom', searchRoom);
});
