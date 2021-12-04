<script>
  import { socket } from '../../stores';
  import TagManager from '../atoms/tagManager.svelte';
  import { customWords } from '../../stores';
  import {_ as t, locale} from 'svelte-i18n';

  const languages = ['en', 'nl']

  let customTags = []
  let customWordsOnly = false;

  customWords.subscribe(value => {
        customTags = value;
  });
</script>
<div>

  <p>Change language here, need to make this is a new component or display this always on every page</p>
  <select on:change={(e) => 
  // prevent users for manipulating the select
  languages.includes(e.target.value) ? locale.set(e.target.value) : null}
  >
  {#each languages as language}
    <option value={language}>{language}</option>
  {/each}
</select>

<h1 class="mb-6 text-red-600">{$t('page.contact.title')}</h1>

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

  <TagManager 
    maxTags="10"
    words={['Sam', 'is', 'dik']}
  />

  <div class="customWordsCheck">
    <input
      class="checkbox"
      name="customWordsOnly"
      type="checkbox"
      id="customWordsOnly"
      bind:checked={customWordsOnly}
    />
    <label for="customWordsOnly">Only use custom words</label>
  </div>

  <button
    class="startGame"
    on:click={() => {
      // pass settings into start game
      // pass custom words to socket
      $socket.emit('gameStart', {
        customTags,
        customWordsOnly,
      });
    }}>Start Game</button
  >
</div>

<style>
</style>
