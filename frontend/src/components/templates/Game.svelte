<script>
  // during game

  import DrawingCanvas from '../molecules/DrawingCanvas.svelte';
  import DrawingToolbox from '../molecules/DrawingToolbox.svelte';
  import RoomCode from '../molecules/RoomCode.svelte';
  import Timer from '../atoms/Timer.svelte';

  import Chat from '../organisms/Chat.svelte';
</script>

<div>
  <Timer />

  <DrawingCanvas />
  <DrawingToolbox />

  <RoomCode />
</div>

<div>
  <Chat />
</div>

<style></style>
