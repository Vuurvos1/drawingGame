<script>
  import { onMount } from 'svelte';
  import io from 'socket.io-client';

  let socket = io('http://localhost:4000');
</script>

<h1 class="font-bold">hello world!</h1>

<button
  on:click={() => {
    socket.emit('testEmit', 'foo');
  }}>send stuff</button
>
