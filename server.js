const express = require('express');
const app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app listening at http://localhost:${port}`);
}

app.use(express.static('public'));


// WebSockets work with the HTTP server
let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('We have a new client: ' + socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('message', ({ room, message }) => {
        socket.to(room).emit('message', {
            message,
            name: '🦐'
        });
    });

    socket.on('disconnect', function() {
        console.log('Client has disconnected');
    });
});









// const express = require('express');
// const app = express();

// let server = app.listen(process.env.PORT || 3000, listen);

// // This call back just tells us that the server has started
// function listen() {
//     let host = server.address().address;
//     let port = server.address().port;
//     console.log(`Example app listening at http://localhost:${port}`);
// }

// app.use(express.static('public'));

// let io = require('socket.io')(server);

// io.sockets.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// })





// io.sockets.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('disconnect', () => {
//         console.log('Client has disconnected');
//     });
// });




// WebSocket Portion
// WebSockets work with the HTTP server
// let io = require('socket.io')(server);

// io.sockets.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('join', (params, callback) => {
//         // if (!isString) {
//         //     console.log('yikes this no string');
//         //     return
//         // }



//         socket.join(params.room);
//         // users.removeUser(socket.id);
//         // users.addUser(socket.id, params.name, params.room);

//         // io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
//         // socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));

//         // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined!'));

//     });

//     socket.on('createMessage', (message, callback) => {
//         console.log('create a message');
//         // let user = users.getUser(socket.id);

//         // if (user && isRealString(message.text)) {
//         //     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
//         // }
//     })

//     socket.on('disconnect', () => {
//         // let user = users.removeUser(socket.id);

//         console.log('Client has disconnected');

//         // if (user) {
//         //     io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
//         //     io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
//         // }
//     });
// });





/*
// Using express: http://expressjs.com/
const express = require('express');
// Create the app
const app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Example app listening at http://localhost:${port}`);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
let io = require('socket.io')(server);


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function(socket) {
        // const roomId = Math.random();
        const roomId = socket.id;
        console.log(`room Id is ${roomId}`);
        console.log('We have a new client: ' + socket.id);

        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('mouse',
            function(data) {
                // Data comes in as whatever was sent, including objects

                console.log(data);

                let dataObj = {
                    // roomId: roomId,
                    url: data.url,
                    x: data.x,
                    y: data.y
                }

                console.log('Received: 'mouse' ' + data.x + ' ' + data.y);
                console.log(dataObj);

                // Send it to all other clients
                socket.broadcast.emit('mouse', dataObj);

                // This is a way to send to everyone including sender
                // io.sockets.emit('message', 'this goes to everyone');
            }
        );

        socket.on('disconnect', function() {
            console.log('Client has disconnected');
        });
    }
);


io.sockets.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (params, callback) => {
        // if (!isString) {
        //     console.log('yikes this no string');
        //     return
        // }



        socket.join(params.room);
        // users.removeUser(socket.id);
        // users.addUser(socket.id, params.name, params.room);

        // io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        // socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));

        // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined!'));

    });

    socket.on('createMessage', (message, callback) => {
        console.log('create a message');
        // let user = users.getUser(socket.id);

        // if (user && isRealString(message.text)) {
        //     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        // }
    })

    socket.on('disconnect', () => {
        // let user = users.removeUser(socket.id);

        console.log('Client has disconnected');

        // if (user) {
        //     io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        //     io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
        // }
    });
});
*/