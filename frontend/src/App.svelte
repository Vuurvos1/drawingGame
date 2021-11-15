<script>
  // components
  import Game from './components/templates/Game.svelte';

  // scripts and variables
  import { onMount } from 'svelte';
  import io from 'socket.io-client';

  let socket = io('http://localhost:4000');
</script>

<h1 class="font-bold">hello world!</h1>

<Game />
