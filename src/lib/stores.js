import { io } from 'socket.io-client';
import { readable, writable } from 'svelte/store';

export const socket = readable(io());
