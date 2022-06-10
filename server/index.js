import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

// TODO extract these
io.on('connection', (socket) => {
	socket.emit('serverEvent', 'hello world 👋');
});

app.use(handler);

server.listen(port);
