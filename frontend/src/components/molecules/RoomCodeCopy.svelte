<script>
  import { socket } from '../../store';

  import { CopyIcon } from 'svelte-feather-icons';

  let roomCode = window.location.origin;

  $socket.on('roomLink', (data) => {
    roomCode = `${window.location.origin}/?${data}`;
  });

  function copyText() {
    navigator.clipboard.writeText(roomCode);

    // TODO user feedback on copy
  }
</script>

<div>
  <input type="text" bind:value={roomCode} readonly />
  <button on:click={copyText} aria-label="copy room code"
    ><CopyIcon size="24" />
  </button>
</div>

<style></style>
