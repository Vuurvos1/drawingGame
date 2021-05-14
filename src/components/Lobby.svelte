<script>
  import Settings from './lobby/lobbySettings.svelte';
  import Players from './lobby/players.svelte';
  import Chat from './Chat.svelte';

  export let roomId;
</script>

<main class="grid">
  <!-- <h1>Lobby</h1> -->

  <Settings {roomId} class="lobby__settings" />
  <Players class="lobby__players" />
  <Chat class="lobby__chat" />
</main>

<style lang="scss">
  h1 {
    grid-column: 2 / 11;
    margin-bottom: 2rem;
    color: white;
  }

  main {
    margin-top: 14vh;
    height: 72vh;
  }

  :global(.lobby__settings) {
    grid-column: 2 / 5;

    padding: 1rem;
    border-radius: 0.25rem;

    --bgCol: var(--bgGray);
    background-color: var(--bgCol);
  }

  :global(.lobby__players) {
    grid-column: 5 / 10;

    padding: 1rem;
    border-radius: 0.25rem;

    --bgCol: var(--bgGray);
    background-color: var(--bgCol);
  }

  :global(.lobby__chat) {
    grid-column: 10 / 12;

    padding: 1rem;
    border-radius: 0.25rem;

    --bgCol: var(--bgGray);
    background-color: var(--bgCol);
  }
</style>
