<script>
  export let open = false;
</script>

{#if open}
  <div>
    <slot />
  </div>
{/if}

<style></style>
