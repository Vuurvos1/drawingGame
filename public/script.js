let socket;
socket = io.connect('localhost:3000');

// Incomming
socket.on('joinRoom', (data) => {
    console.log(data);
});

socket.on('message', (data) => {
    console.log(data);
});

// Outgoing
const roomTxt = document.querySelector('#room input[type=text]');
const roomSend = document.querySelector('#room button');

const msgTxt = document.querySelector('#send input[type=text]');
const msgSend = document.querySelector('#send button');


roomSend.addEventListener('click', () => {
    console.log('join room send');
    console.log(roomTxt.value);
    let data = roomTxt.value;

    socket.emit('joinRoom', data);
});

msgSend.addEventListener('click', () => {
    console.log('text msg send');
    let data = {
        room: roomTxt.value,
        message: msgTxt.value
    };

    socket.emit('message', data);
});