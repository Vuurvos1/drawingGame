let socket = io.connect(window.location.host);

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

// room sharing
const roomTxt = document.querySelector('.roomCode__Text');
const roomSend = document.querySelector('#room button');

// chatting
const msgTxt = document.querySelector('.game__chat input[type=text]');
const msgSend = document.querySelector('.game__chat button[type=submit]');
const chatbox = document.querySelector('.game__chat__chatbox');

const playerGrid = document.querySelector('.game__users');

// shorter queryselectors
// querySelector
const q = document.querySelector.bind(document);
// querySelectorAll
const qa = document.querySelectorAll.bind(document);

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

socket.on('roomUser', (data) => {
  console.log(data);
});

// Outgoing
msgSend.addEventListener('click', (e) => {
  e.preventDefault();

  if (msgTxt.value.trim() == '') {
    return;
  }

  let data = {
    message: msgTxt.value.trim(),
    id: socket.id,
  };
  chatbox.innerHTML += `
  <p>
    <b>${data.id}:</b> ${data.message}
  </p>`;

  socket.emit('message', data);

  msgTxt.value = '';
});

// when DOM is laoded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');
  socket.emit('joinRoom', searchRoom);
});
