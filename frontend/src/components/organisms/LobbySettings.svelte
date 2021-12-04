<script>
  import { socket } from "../../stores";
  import TagManager from "../atoms/tagManager.svelte";
  import { customWords } from "../../stores";
  import LanguageSwitch from "../atoms/LanguageSwitch.svelte";
  import { _ as t, locale } from "svelte-i18n";

  let customTags = [];
  let customWordsOnly = false;

  customWords.subscribe((value) => {
    customTags = value;
  });
</script>

<div>
  <LanguageSwitch />

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

  <TagManager maxTags="10" words={['Sam', 'is', 'dik']} />

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
