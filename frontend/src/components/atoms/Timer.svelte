<script>
  import { onDestroy } from 'svelte';

  import { socket } from '../../stores';

  let time = 0;
  let totalTime = 30;
  let choosenWord = '';
  let wordChoices = [];

  $socket.on('gameStart', (data) => {
    console.log('gameStart', data);

    const { word, wordsToPick } = data;

    choosenWord = word;
    wordChoices = wordsToPick;

    console.log(wordChoices);
    // set timer`
    // totalTime = data;
  });

  let interval;

  $socket.on('setTimer', (data) => {
    // update timer
    totalTime = data;
    time = data;

    interval = setInterval(() => {
      time -= 1;

      // TODO ensure time can't go below 0
    }, 1000);
  });

  $socket.on('roundEnd', (data) => {
    // console.log('round end');

    // update timer
    time = 0;

    clearInterval(interval); // clear interval
  });

  onDestroy(() => {
    clearInterval(interval); // clear interval to prevent memory leak
  });
</script>

<!-- maybe thange this to some sort of clock -->
<span>
  {time} / {totalTime}

  {#if choosenWord !== ''}
    <span>Your word is : {choosenWord}</span>
  {/if}

  {#if wordChoices.length > 0}
    <h2>Words to pick from</h2>
    {#each wordChoices as word}
      <button class="p-4 cursor-pointer">{word}</button>
    {/each}
  {/if}
</span>
