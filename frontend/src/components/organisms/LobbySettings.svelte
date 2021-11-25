<script></script>

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
    />
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

  <button class="startGame">Start Game</button>
</div>

<style></style>
