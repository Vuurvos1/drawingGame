<script>
  import { afterUpdate, beforeUpdate } from 'svelte';
  import { socket } from '../../stores';

  // TODO prevent message spam through some sort of throttle

  let chatbox;
  let autoscroll;
  let chatValue = '';

  let messages = [];

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  function sendMessage() {
    chatValue = chatValue.trim();

    if (!chatValue) {
      return;
    }

    messages = messages.concat({ text: chatValue });
    $socket.emit('chat', { text: chatValue });

    chatValue = '';
  }

  $socket.on('chat', (data) => {
    messages = messages.concat(data);
  });

  beforeUpdate(() => {
    autoscroll =
      chatbox &&
      chatbox.offsetHeight + chatbox.scrollTop > chatbox.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) chatbox.scrollTo(0, chatbox.scrollHeight);
  });
</script>

<!-- chatbox -->
<!-- these could be better elements? -->
<div class="scrollable flex-1" bind:this={chatbox}>
  {#each messages as message}
    <div>
      <span>{message.text}</span>
    </div>
  {/each}
</div>

<!-- message form -->
<div>
  <input
    class="border border-black rounded"
    type="text"
    bind:value={chatValue}
    on:keydown={handleKeyDown}
  />
  <button
    class="px-2 border border-solid border-black rounded hover:bg-gray-200"
    on:click={sendMessage}
  >
    send
  </button>
</div>

<style>
  .scrollable {
    overflow-y: auto;
  }
</style>
