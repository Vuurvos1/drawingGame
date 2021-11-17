import io from 'socket.io-client';
import { writable, readable } from 'svelte/store';

// get url from env
export const socket = readable(io('http://localhost:4000'));

export const canvasTools = writable({
  color: '#000000',
  size: 2,
});
