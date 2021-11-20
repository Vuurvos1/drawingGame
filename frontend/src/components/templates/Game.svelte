<script>
  // during game
  import DrawingCanvas from '../molecules/DrawingCanvas.svelte';
  import DrawingToolbox from '../molecules/DrawingToolbox.svelte';
  import RoomCodeCopy from '../molecules/RoomCodeCopy.svelte';

  import Chat from '../organisms/Chat.svelte';
</script>

<div>
  <DrawingCanvas />
  <DrawingToolbox />

  <RoomCodeCopy />
</div>

<div>
  <Chat />
</div>

<style></style>
