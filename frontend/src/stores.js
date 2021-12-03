import io from 'socket.io-client';
import { writable, readable } from 'svelte/store';

// get url from env
export const socket = readable(io(`http://localhost:4000`));

export const customWords = writable([]);

function createGameManager() {
  const { subscribe, set, update } = writable({
    users: [],
    gameState: '',
    score: 0,
    tool: {
      color: '#000000',
      tool: 'brush',
      size: 3,
    },
  });

  const setBrushColor = (color) =>
    update((value) => {
      value.tool.color = color;
      return value;
    });

  const setBrushSize = (size) =>
    update((value) => {
      value.tool.size = size;
      return value;
    });

  const setTool = (tool) =>
    update((value) => {
      value.tool.tool = tool;
      return value;
    });

  return {
    subscribe,
    setBrushColor,
    setBrushSize,
    setTool,
  };
}

export const gameManager = createGameManager();
