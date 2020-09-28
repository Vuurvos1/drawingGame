let socket = io.connect(window.location.host);

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

const roomTxt = document.querySelector('#room input[type=text]');
const roomSend = document.querySelector('#room button');

const msgTxt = document.querySelector('#send input[type=text]');
const msgSend = document.querySelector('#send button');

const playerGrid = document.querySelector('.players .players__grid');

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

socket.on('userJoin', (data) => {
  playerGrid.innerHTML += `
    <div class="players__user">
      <img src="img/userImg/user${data}.png" alt="User photo ${data}" />
      <h3>User ${data}</h3>
      <h4></h4>
    </div>
`;
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
  // socket.emit('pickUser');
});
