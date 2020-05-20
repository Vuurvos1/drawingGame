let socket;
socket = io.connect('localhost:3000');


// function setup() {
//     console.log('yeeps')
//         // createCanvas(400, 400);
//         // background(0);
//         // Start a socket connection to the server
//         // Some day we would run this server somewhere else
//     socket = io.connect('https://multiplayer-game-testing.herokuapp.com/');
//     // socket = io.connect('localhost:3000');
//     // We make a named event called 'mouse' and write an
//     // anonymous callback function
//     socket.on('mouse',
//         // When we receive data
//         function(data) {
//             let str = window.location.search.slice(1);

//             console.log(str);
//             console.log(data.roomId)

//             if (str == data.url && str != '') {
//                 // console.log("Got: " + data.x + " " + data.y);
//                 // Draw a blue circle
//                 fill(0, 0, 255);
//                 noStroke();
//                 ellipse(data.x, data.y, 20, 20);
//             }
//         }
//     );
// }

// setup();



// socket.on('connect', () => {

//     socket.emit('join', (err) => {
//         if (err) {
//             alert('something went wong');
//             window.location.href = '/';
//         } else {
//             console.log('no error 🦐');
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('Disconected 🦀');
//     });

//     socket.on('newMessage', (message) => {
//         console.log(message);
//     });
// });



// const sendButton = document.querySelector('#sendText');
// const message = document.querySelector('#textMessage');

// sendButton.addEventListener('click', (e) => {
//     e.preventDefault();

//     let data = {
//         text: message.value
//     }

//     socket.emit('createMessage', data);

//     message.value = '';
// });