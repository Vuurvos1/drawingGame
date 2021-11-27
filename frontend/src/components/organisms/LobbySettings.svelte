<script>
  import { socket } from '../../stores';

  let customWords = [];
   console.log(customWords)
</script>

<div>
  <div class="rounds">
    <label for="rounds">Rounds</label>
    <input
      type="number"
      name="rounds"
      id="rounds"
      value="3"
      min="1"
      max="25"
      maxlength="3"
    />
  </div>

  <div class="drawTime">
    <label for="drawTime" id="drawTime">Draw Time</label>
    <input
      type="number"
      name="drawTime"
      value="30"
      min="1"
      max="120"
      maxlength="3"
    />
  </div>

  <div class="customWords">
    <label for="customWords">Custom Words</label>
    <textarea
      name="customWords"
      cols="30"
      rows="10"
      placeholder="Type your custom words here separated by commas
    "
    on:input={(e) => {
      // get words sepeared by commas
      const word = e.target.value.split(',');

      // remove empty words this prevent displaying an empty div after a comma
      customWords = word.filter(word => word.length > 0);
    }}
    />
    <div class="customWords flex flex-row gap-3">
      {#each customWords as word}
        <div class="tag p-1 bg-gray-900 border-r-2 text-white">
            {word}
        </div>
      {/each}
  </div>
  </div>

  <div class="customWordsCheck">
    <input
      class="checkbox"
      name="customWordsOnly"
      type="checkbox"
      id="customWordsOnly"
    />
    <label for="customWordsOnly">Only use custom words</label>
  </div>

  <button
    class="startGame"
    on:click={() => {
      // pass settings into start game
      $socket.emit('gameStart', {});
    }}>Start Game</button
  >
</div>

<style></style>
