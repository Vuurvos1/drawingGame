import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from '../build/handler.js';
import { socketEvents } from './socket.js';

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
	socketEvents(io, socket);
});

app.use(handler);

server.listen(port);
