<script>
  // setup user profile here, username, icon
  // TODO some of this data could be stored in local storage for future sessions
  import { socket } from '../../stores';
  import TextInput from '../atoms/TextInput.svelte';

  let username = '';

  function joinLobby() {
    username = username.trim();
    if (username != '') {
      // expand object with more user specific data
      $socket.emit('joinLobby', {
        username: username,
      });
    }
  }
</script>

<div>
  <label for="username">Username</label>
  <TextInput type="text" id="username" bind:value={username} />

  <button on:click={joinLobby}>Join game</button>
</div>

<style></style>
