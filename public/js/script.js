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
  roomTxt.value = `${window.location.origin}/?${data}`;
});

socket.on('startGame', (data) => {
  lobby.style.display = 'none';
  game.style.display = 'grid';
});

socket.on('test', (data) => {
  // create element
  let element = '<ul class="wordChoises">';

  for (const i of data) {
    element += `
    <li>
      <button>
        ${i}
      </button>
    </li>`;
  }

  element += '</ul>';

  q('footer').innerHTML += element;

  // query all
  let buttons = qa('.wordChoises li');

  // add socket event
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      socket.emit('pickWord', data[i]);
      q('.game__header__word').innerHTML = data[i];

      // remove choises
      const el = q('.wordChoises');
      el.parentNode.removeChild(el);

      // // temp end turn button
      let el2 = `<button>End turn</button>`;
      q('footer').innerHTML += el2;
      q('footer button').addEventListener('click', () => {
        socket.emit('nextTurn', true);

        // delete self
        const el = q('footer button');
        el.parentNode.removeChild(el);
      });
    });
  }
});

// Outgoing
msgSend.addEventListener('click', (e) => {
  e.preventDefault();

  if (msgTxt.value.trim() == '') {
    return;
  }

  const data = {
    message: msgTxt.value
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;'),
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
  socket.emit('startGame', true);
});

// when DOM is loaded join room
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀');
  socket.emit('joinRoom', searchRoom);
});
