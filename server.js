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
        console.log(room);
        socket.join(room);
    });

    socket.on('message', (data) => {
        console.log(data.room);
        console.log(data.message);

        let data2 = {
            room: data.room,
            name: '🦐',
            message: data.message
        }

        socket.to(data.room).emit('message', data2);
    });

    socket.on('disconnect', function() {
        console.log('Client has disconnected');
    });
});