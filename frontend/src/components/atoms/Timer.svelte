<script>
  import { socket } from '../../stores';

  let time = 0;
  let totalTime = 30;
  let word = '';

  $socket.on('gameStart', (data) => {
    console.log('gameStart', data);
    word = data.word;
    // set timer`
    // totalTime = data;
  });

  $socket.on('timer', (data) => {
    // update time
    console.log('timer');
    time = data;
  });
</script>

<!-- maybe thange this to some sort of clock -->
<span>
  {time} / {totalTime}

  {#if word !== ''}
    <span>Your word is : {word}</span>
  {/if}
</span>
