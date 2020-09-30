let socket = io.connect(window.location.host);

let searchRoom = window.location.search;
// Remove questionmark
searchRoom = searchRoom.slice(1).trim();

const roomTxt = document.querySelector('.roomCode__Text');
const roomSend = document.querySelector('#room button');

const msgTxt = document.querySelector('#send input[type=text]');
const msgSend = document.querySelector('#send button');

const playerGrid = document.querySelector('.players .players__grid');
const copyLinkButton = document.querySelector('.button--copyLink');

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
    <div class="players__user ${data.id}">
      <img src="img/userImg/user${data.imageId}.png" 
        alt="User photo ${data.imageId}" />
      <h3>User ${data.imageId}</h3>
      <h4>${data.you ? 'You' : ''}</h4>
    </div>
`;
});

socket.on('roomUser', (data) => {
    console.log(data)
})

socket.on('userLeave', (data) => {
  const el = document.querySelector(`.${data.id}`);
  el.parentNode.removeChild(el);
});

// Outgoing
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

copyLinkButton.addEventListener('click', () => {
  const text = roomTxt.value;

  // Create a fake textarea
  const textAreaEle = document.createElement('textarea');

  // Reset styles
  textAreaEle.style.border = '0';
  textAreaEle.style.padding = '0';
  textAreaEle.style.margin = '0';

  // Set the absolute position
  // User won't see the element
  textAreaEle.style.position = 'absolute';
  textAreaEle.style.left = '-9999px';
  textAreaEle.style.top = `0px`;

  // Set the value
  textAreaEle.value = text;

  // Append the textarea to body
  document.body.appendChild(textAreaEle);

  // Focus and select the text
  textAreaEle.focus();
  textAreaEle.select();

  // Execute the "copy" command
  try {
    document.execCommand('copy');
  } catch (err) {
    // Unable to copy
  } finally {
    // Remove the textarea
    document.body.removeChild(textAreaEle);
  }
});

// build canvas
// add canvas
// toolbar to pick brush and stuff

// for loop players

// chat / place to guess
