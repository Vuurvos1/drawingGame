<script>
  import Chat from './Chat.svelte';
  import Canvas from './game/Canvas.svelte';
  import CanvasTools from './game/CanvasTools.svelte';
  import GameHeader from './game/GameHeader.svelte';
  import GamePlayers from './game/GamePlayers.svelte';
</script>

<main class="grid">
  <GameHeader class="game__header" />
  <GamePlayers class="game__players" />
  <Canvas class="game__canvas" />
  <Chat class="game__chat" />
  <CanvasTools class="game__tools" />
</main>

<style lang="scss">
  :global(.game__header) {
    grid-column: 2/12;
    background-color: pink;
  }

  :global(.game__players) {
    grid-column: 2/4;
    background-color: aquamarine;
  }

  :global(.game__chat) {
    grid-column: 10/12;
    background-color: hotpink;
  }

  :global(.game__canvas) {
    grid-column: 4/10;
    background-color: white;
  }

  :global(.game__tools) {
    grid-column: 4/10;
    background-color: green;
  }
</style>
