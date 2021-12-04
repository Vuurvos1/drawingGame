<script>
  import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

  import en from '../src/locales/en.json';
  import nl from '../src/locales/nl.json';
  addMessages('en', en);
  addMessages('nl', nl);

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
  });

  // components
  import Profile from './components/templates/Profile.svelte';
  import Lobby from './components/templates/Lobby.svelte';
  import Game from './components/templates/Game.svelte';

  // scripts and variables
  import { socket, users, gameState } from './stores';
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

<style></style>
