<script>
  import Settings from './lobby/lobbySettings.svelte';
  import Players from './lobby/players.svelte';
  import Chat from './Chat.svelte';

  export let roomId;
</script>

<main class="grid">
  <h1>Lobby</h1>

  <Settings {roomId} class="lobby__settings" />
  <Players class="lobby__players" />
  <Chat class="lobby__chat" />
</main>

<style lang="scss">
  h1 {
    grid-column: 2/11;
    margin-bottom: 2rem;
    color: white;
  }

  main {
    margin-top: 6rem;
  }
  :global(.lobby__settings) {
    grid-column: 2/5;
    background-color: pink;
  }

  :global(.lobby__players) {
    grid-column: 5/9;
    background-color: hotpink;
  }

  :global(.lobby__chat) {
    grid-column: 9/11;
    background-color: aquamarine;
  }
</style>
