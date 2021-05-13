<script>
  import { q } from '../../modules/helpers';
  import NumberInput from '../atoms/NumberInput.svelte';
  import TextInput from '../atoms/TextInput.svelte';
  import { socket, gameState } from './../../store';

  export let roomId;

  // $: roomId = '';
  $socket.on('roomValue', (data) => {
    roomId = `${window.location.origin}/?${data}`;
  });

  function gameStart(e) {
    e.preventDefault();
    $gameState = 'game';
  }

  function copyLink() {
    // copy game room url
    const text = roomId;
    // Create a fake textarea
    const textAreaEle = document.createElement('textarea');
    // Reset styles
    textAreaEle.style.border = '0';
    textAreaEle.style.padding = '0';
    textAreaEle.style.margin = '0';
    // Set the absolute position
    // User won't see the element
    textAreaEle.style.position = 'absolute';
    textAreaEle.style.left = '-9999px';
    textAreaEle.style.top = `0px`;
    // Set the value
    textAreaEle.value = text;
    // Append the textarea to body
    document.body.appendChild(textAreaEle);
    // Focus and select the text
    textAreaEle.focus();
    textAreaEle.select();
    // Execute the "copy" command
    try {
      document.execCommand('copy');
    } catch (err) {
      // Unable to copy
    } finally {
      // Remove the textarea
      document.body.removeChild(textAreaEle);
    }
  }
</script>

<div class={$$props.class}>
  <NumberInput
    label="Rounds"
    name="rounds"
    value="3"
    min="1"
    max="25"
    maxlength="3"
  />

  <NumberInput
    label="Draw time"
    name="rounds"
    value="60"
    min="1"
    max="120"
    maxlength="3"
  />

  <div class="customWords">
    <label for="customWords">Custom words</label>
    <textarea
      id="customWords"
      placeholder="Custom words separated by commas"
      name="customWords"
      type="textarea"
      rows="5"
    />
  </div>

  <!-- <label for="language"></label>
    <select id="language" name="language">
      <option value="english">English</option>
      <option value="dutch">Dutch</option>
    </select> -->

  <div class="roomCode">
    <label for="">Room code</label>
    <input
      class="roomCode__Text"
      on:click={copyLink}
      value={roomId}
      type="text"
      readonly
    />

    <span class="tooltiptext">Click to copy</span>
  </div>

  <button class="startGame" on:click={gameStart}>Start Game</button>
</div>

<style lang="scss">
  .customWords {
    position: relative;
    margin-bottom: 2rem;

    label {
      font-size: 0.75rem;
      position: absolute;

      margin-left: 0.6rem;
      padding: 0 0.2rem;

      left: 1px;
      top: -6px;

      background-color: var(--bgCol);
    }

    textarea {
      font-size: 1rem;

      outline: 0;
      padding: 1rem 0.8rem;
      width: 100%;

      border: 1px solid rgba(var(--rgbText), 0.5);
      border-radius: 0.25rem;

      background-color: var(--bgCol);
    }
  }

  .roomCode {
    margin-bottom: 2rem;
    position: relative;

    .tooltiptext {
      position: absolute;
      left: calc(100% - 14ch - 1rem);
      top: 1.1rem;

      width: 14ch;

      text-align: right;

      color: rgba(0, 0, 0, 0.5);

      z-index: 1;

      opacity: 0;

      pointer-events: none;

      transition: opacity 0.2s ease;
    }

    &:hover {
      .tooltiptext {
        opacity: 1;
      }
    }

    label {
      position: absolute;
      font-size: 0.75rem;

      margin-left: 0.6rem;
      padding: 0 0.2rem;

      left: 1px;
      top: -6px;

      background-color: var(--bgCol);
    }

    input {
      font-size: 1rem;
      outline: 0;
      padding: 1rem 0.8rem;
      width: 100%;

      border: 1px solid rgba(var(--rgbText), 0.5);
      border-radius: 0.25rem;

      background: none;

      // blur text
      color: transparent;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

      cursor: pointer;

      &:hover,
      &:focus {
        color: var(--black);
        text-shadow: none;
      }
    }
  }

  .startGame {
    display: block;
    margin-left: auto;
    padding: 0.8rem 1rem;

    font-weight: bold;
    font-size: 1rem;
    background-color: #fca311;
    outline: none;
    border-radius: 0.25rem;
  }
</style>
