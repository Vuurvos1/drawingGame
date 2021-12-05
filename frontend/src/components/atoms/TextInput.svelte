<script>
  import { randomString } from '../../modules/utils';

  export let label = '';
  export let value = '';
  export let name;
  export let id = randomString(6);
</script>

<div class="textInput">
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  <input
    class="border border-black rounded"
    {id}
    {name}
    bind:value
    type="text"
    on:change
    on:input
  />
</div>

<style></style>
