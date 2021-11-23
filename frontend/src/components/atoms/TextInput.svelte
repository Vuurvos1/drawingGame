<script>
  export let label;
  export let value;
</script>

{#if label}
  <label for="">{label}</label>
{/if}

<input class="border border-black rounded" bind:value type="text" />

<style></style>
