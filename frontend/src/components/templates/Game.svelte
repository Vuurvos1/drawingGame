<script>
  // during game
  import DrawingCanvas from '../molecules/DrawingCanvas.svelte';
  import DrawingToolbox from '../molecules/DrawingToolbox.svelte';
  import RoomCode from '../molecules/RoomCode.svelte';

  import Chat from '../organisms/Chat.svelte';
</script>

<div>
  <DrawingCanvas />
  <DrawingToolbox />

  <RoomCode />
</div>

<div>
  <Chat />
</div>

<style></style>
