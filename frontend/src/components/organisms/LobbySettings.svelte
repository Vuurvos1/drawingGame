<script>
  import { socket } from '../../stores';

  let customWords = [];

  // could be handy to implement this maybe
  const maxTags = 10;

   const addTag = (e) => {
    if (e.key == 'Enter') {
      // removing unwanted spaces
      let tag = e.target.value.replace(/\s/g, ' ')

      // check if tag has already been added and check length of it
      if (tag.length > 1 && !customWords.includes(tag) && customWords.length < maxTags) {
        tag.split(',').forEach(tag => {
         customWords.push(tag)
         // reassign so svelte updates the array
         customWords = [...customWords];
        });
      }
      // reset input
      e.target.value = '';
      }
  }

  const deleteTag = (index) => {
    customWords.splice(index, 1);
    customWords = [...customWords];
  }

  const deleteAllTags = () => {
    customWords = [];
    customWords = [...customWords];
  }

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

  <div class="wrapper">
    <div class="title">
      <h2>Tags</h2>
    </div>
    <div class="content">
      <p>Press enter or add a comma after each tag</p>
      <div class="tag-box">
        <ul>
         {#if customWords.length > 0}
            {#each customWords as word, index}
              <li>{word} <span on:click={() => deleteTag(index)}>X</span></li>
            {/each}
          {/if}
          <input 
            type="text" 
            name="customWords" 
            class="input"
            on:keyup={(e) => addTag(e)}
            placeholder="Svelte,Mona"
          >
        </ul>
      </div>
    </div>
    <div class="details">
      <p>{maxTags - customWords.length} tags remaining</p>
      <button on:click={() => deleteAllTags()}>Remove all tags</button>
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

<style>
  .wrapper {
    width: 490px;
    /* background-color: hotpink; */
    border-radius: 10px;
    padding: 18px 25px 20px;
  }

  .wrapper .title {
    display: flex;
    align-items: center;
  }

  .wrapper .title h2 {
    font-size: 21px;
    font-weight: 600;
    margin-left: 8px;
  }

  .wrapper .content {
    margin: 10px 0;
  }
  .content {
    font-size: 15px;
  }
  .content ul {
    display: flex;
    flex-wrap: wrap;
    padding: 7px;
    border: 1px solid #a6a6a6;
    border-radius: 5px;
    margin: 12px 0px;
  }
  .content ul li {
    list-style: none;
    background-color:rgb(41, 46, 195);
    color: white;
    padding: 5px 8px 5px 10px;
    margin: 4px 3px;
    border-radius: 5px;
    border: 1px solid #e3d1e1;
  }
  /* // close icons */
  .content ul li span {
    height: 30px;
    width: 30px;
    font-size: 12px;
    margin-left: 8px;
    color: white;
    cursor: pointer;
  }
  .content ul .input {
    flex: 1;
    outline: none;
    padding: 5px;
    font-size: 16px;
    border: none;
  }
  .wrapper .details {
    display: flex;
    justify-content: space-between;
  }
  .wrapper .details button {
    background-color:  red;
    border-radius: 5px;
    color: white;
    padding: 0.5rem;
  }
</style>
