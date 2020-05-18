let socket;
socket = io.connect('localhost:3000');
console.log(socket);



socket.on('connect', () => {

    socket.emit('join', (err) => {
        if (err) {
            alert('something went wong');
            window.location.href = '/';
        } else {
            console.log('no error 🦐');
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconected 🦀');
    });

    socket.on('newMessage', (message) => {
        console.log(message);
    });
});



const sendButton = document.querySelector('#sendText');
const message = document.querySelector('#textMessage');

sendButton.addEventListener('click', (e) => {
    e.preventDefault();

    let data = {
        text: message.value
    }

    socket.emit('createMessage', data);

    message.value = '';
});