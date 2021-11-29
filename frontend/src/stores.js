import io from 'socket.io-client';
import { writable, readable } from 'svelte/store';

// get url from env
export const socket = readable(io(`http://localhost:4000`));

export const canvasTools = writable({
  color: '#000000',
  tool: 'brush',
  size: 2,
});

export const users = writable([]);
export const customWords = writable([]);
export const gameState = writable('');

// maybe move most game releted stuff into one (readable) store?
