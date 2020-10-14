let socket = io.connect(window.location.host);

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

// shorter queryselectors
// querySelector
const q = document.querySelector.bind(document);
// querySelectorAll
const qa = document.querySelectorAll.bind(document);

// convert all element selectors into a single object?
// room sharing
const roomTxt = document.querySelector('.roomCode__Text');
const roomSend = document.querySelector('#room button');

// chatting
const msgTxt = document.querySelector('.game__chat input[type=text]');
const msgSend = document.querySelector('.game__chat button[type=submit]');
const chatbox = document.querySelector('.game__chat__chatbox');

const playerGrid = document.querySelector('.game__users');

const lobby = q('.lobby');
const game = q('.game');

// Incomming
socket.on('message', (data) => {
  chatbox.innerHTML += `
  <p>
    <b>${data.name}:</b> ${data.message}
  </p>`;
});

socket.on('roomValue', (data) => {
  roomTxt.value = `${window.location.href}?${data}`;
});

socket.on('startGame', (data) => {
  console.log('start inc');

  lobby.style.display = 'none';
  game.style.display = 'grid';
});

// Outgoing
msgSend.addEventListener('click', (e) => {
  e.preventDefault();

  if (msgTxt.value.trim() == '') {
    return;
  }

  const data = {
    message: msgTxt.value.trim(),
    id: socket.id,
  };
  chatbox.innerHTML += `
  <p>
    <b>You:</b> ${data.message}
  </p>`;

  socket.emit('message', data);

  msgTxt.value = '';
});

q('.startGame').addEventListener('click', (e) => {
  e.preventDefault();

  console.log('saaa');

  socket.emit('startGame', true);
});

// when DOM is loaded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');
  socket.emit('joinRoom', searchRoom);
});
