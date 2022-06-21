import { browser } from '$app/env';
import { io } from 'socket.io-client';
import { readable, writable } from 'svelte/store';
import { isJsonString } from '$lib/utils';

export const socket = readable(io());

const defaultUser = { name: '', avatar: '' };
let localUser = browser ? window.localStorage.getItem('user') ?? defaultUser : defaultUser;
localUser = isJsonString(localUser) ? JSON.parse(localUser) : defaultUser;

export const user = writable(localUser);
user.subscribe((value) => {
	if (browser) {
		// TODO debounce this for small preformance gain?
		window.localStorage.setItem('user', JSON.stringify(value));
	}
});

export const users = writable([]);

export const canvasTool = writable({
	tool: 'brush',
	size: 2,
	color: '#000000'
});
