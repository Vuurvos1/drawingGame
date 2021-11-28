<script>
    import { MinusIcon } from 'svelte-feather-icons'
    // specify the custom words that the array will have
    export let customWords = [];
    // specify the maxium of tags that are allowed
    export let maxTags = 10;

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
  
<div class="customTags">
    <div class="title">
      <h2>Tags</h2>
    </div>
    <div class="content">
      <p>Press enter or add a comma after each tag</p>
      <div class="tag-box">
        <ul>
         {#if customWords.length > 0}
            {#each customWords as word, index}
              <li>
                  <span class="word">{word}</span> 
                    <!-- <span on:click={() => deleteTag(index)}><MinusIcon size="0.5x"/></span> -->
                    <span on:click={() => deleteTag(index)} class="close">
                        <MinusIcon size="1x"/>
                    </span>
                </li>
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
  
<style>
    .customTags {
    width: 490px;
    /* background-color: hotpink; */
    background-color: #f8f9fd;
    box-shadow: 0 15px 50px rgb(0 0 0 / 10%);
    border-radius: 10px;
    padding: 18px 25px 20px;
  }

  .customTags .title {
    display: flex;
    align-items: center;
  }

  .customTags .title h2 {
    font-size: 21px;
    font-weight: 600;
    margin-left: 8px;
  }

  .customTags .content {
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
    display: flex;
    align-items: center;
  }

  .content ul li .word {
    margin-right: 8px;
    color: white;
  }

  .content ul li .close {
      cursor: pointer;
  }
  .content ul .input {
    flex: 1;
    outline: none;
    padding: 5px;
    font-size: 16px;
    border: none;
  }
  .customTags .details {
    display: flex;
    justify-content: space-between;
  }
  .customTags .details button {
    background-color:  red;
    border-radius: 5px;
    color: white;
    padding: 0.5rem;
  }
</style>
  