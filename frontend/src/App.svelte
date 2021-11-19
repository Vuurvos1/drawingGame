<script>
  // components
  import Game from './components/templates/Game.svelte';

  // scripts and variables
  import { socket } from './store';
  import { onMount } from 'svelte';

  onMount(() => {
    // use substring to remove question mark
    $socket.emit('joinRoom', window.location.search.substring(1));
  });
</script>

<h1 class="font-bold">hello world!</h1>

<Game />
