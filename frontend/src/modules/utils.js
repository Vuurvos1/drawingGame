import { onDestroy } from 'svelte';

export function throttle(callback, delay) {
  let previousCall = new Date().getTime();
  return function () {
    let time = new Date().getTime();

    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

export function randomString(length = 6) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = characters.length;
  let output = '';

  for (let i = 0; i < length; i++) {
    output += characters.charAt(~~(Math.random() * charsLength));
  }

  return output;
}

export const hexToRgba = (hex, alpha = 255) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return [r, g, b, alpha];
};

export function onInterval(callback, milliseconds) {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
}
