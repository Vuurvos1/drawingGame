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

export const hexToRgba = (hex, alpha = 255) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return [r, g, b, alpha];
};
