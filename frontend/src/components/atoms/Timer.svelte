<script>
  import { socket } from '../../stores';

  let time = 0;
  let totalTime = 30;

  $socket.on('gameStart', (data) => {
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
</span>
