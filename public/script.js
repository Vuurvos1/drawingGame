let socket;
socket = io.connect('localhost:3000');
// socket = io.connect('https://multiplayer-game-testing.herokuapp.com/');

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

const roomTxt = document.querySelector('#room input[type=text]');
const roomSend = document.querySelector('#room button');

const msgTxt = document.querySelector('#send input[type=text]');
const msgSend = document.querySelector('#send button');

// Incomming
socket.on('joinRoom', (data) => {
  console.log(data);
});

socket.on('message', (data) => {
  console.log(data);
});

socket.on('roomValue', (data) => {
  roomTxt.value = `${window.location.href}?${data}`;
});

// Outgoing
roomSend.addEventListener('click', () => {
  console.log('Ik doe niks 🌈');
});

msgSend.addEventListener('click', () => {
  console.log('text msg send');
  let data = {
    message: msgTxt.value,
  };

  socket.emit('message', data);
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');
  socket.emit('joinRoom', searchRoom);
});
