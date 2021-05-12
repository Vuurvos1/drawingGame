<script>
  export let type = 'text';
  export let name = '';
  export let label = 'Sample text';
  export let rows = 5;
  export let req = false;
</script>

<div class="textInput">
  {#if type == 'textarea'}
    <textarea id={name} placeholder={label} {rows} required={req} />
  {:else}
    <input id={name} placeholder={label} {type} required={req} />
  {/if}

  <label for={name}>{label}</label>
</div>

<style lang="scss">
  .textInput {
    margin-bottom: 4ch;
    position: relative;

    label {
      font-size: 1rem;

      position: absolute;
      margin-left: 0.6rem;
      padding: 0 0.2rem;

      left: 1px;

      transform-origin: top left;
      transform: translate(0, 1.05rem) scale(1);
      transition: all 0.1s ease-out;

      // color: rgba(var(--rgbText), 1);
    }

    input,
    textarea {
      font-size: 1rem;
      outline: 0;
      padding: 1rem 0.8rem;
      width: 100%;

      border: 1px solid rgba(var(--rgbText), 0.5);
      border-radius: 0.25rem;

      &:focus ~ label,
      &:not(:placeholder-shown) ~ label {
        transform: translateY(-0.35rem) scale(0.75);
        background-color: white;
      }
    }

    textarea {
      resize: none;
    }
  }
</style>
