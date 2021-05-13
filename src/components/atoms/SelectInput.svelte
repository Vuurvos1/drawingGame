<script>
  export let value = '';
  export let options = [{ name: 'Option 1', value: 'option1' }];
</script>

<!-- <label for="">Select</label> -->
<select bind:value>
  {#each options as option}
    <option value={option.value}>{option.name}</option>
  {/each}
</select>

<style lang="scss">
  select {
    font-size: 1rem;
    outline: 0;
    padding: 1rem 0.8rem;
    width: 100%;

    margin-bottom: 2rem;

    border: 1px solid rgba(var(--rgbText), 0.5);
    border-radius: 0.25rem;
  }
</style>
