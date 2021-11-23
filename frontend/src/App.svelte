<script>
  // components
  import Profile from './components/templates/Profile.svelte';
  import Lobby from './components/templates/Lobby.svelte';
  import Game from './components/templates/Game.svelte';

  // scripts and variables
  import { socket, users } from './stores';
  import { onMount } from 'svelte';

  onMount(() => {
    // use substring to remove question mark
    $socket.emit('joinRoom', window.location.search.substring(1));

    $socket.on('setUsers', (data) => {
      $users = data;
    });
  });
</script>

<h1 class="font-bold">hello world!</h1>

<Profile />

<Lobby />

<Game />
