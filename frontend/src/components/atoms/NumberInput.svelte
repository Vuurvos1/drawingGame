<script>
  import { randomString } from '../../modules/utils';

  export let label = '';
  export let min;
  export let max;
  export let maxlength = 3;
  export let value;
  export let name;
  export let id = randomString(6);
</script>

<div class="numberInput">
  {#if label != ''}
    <label for={id}>Draw Time</label>
  {/if}

  <input
    bind:value
    class="border border-black rounded"
    type="number"
    {name}
    {min}
    {max}
    {id}
    {maxlength}
    on:change
    on:input
  />
</div>

<style></style>
