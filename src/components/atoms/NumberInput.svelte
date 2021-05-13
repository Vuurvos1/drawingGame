<script>
  export let type = 'number';
  export let name = '';
  export let value = 3;
  export let min = 0;
  export let max = 25;
  export let maxlength = null;
  export let label = 'sample text';

  // name = 'rounds';
  // value = '3';
  // min = '1';
  // max = '25';
  // maxlength = '3';
  // type = 'number';
</script>

<div class="numberInput">
  <label for={name}>{label}</label>
  <input id={name} {type} {value} {min} {max} />
</div>

<style lang="scss">
  .numberInput {
    position: relative;
    margin-bottom: 2rem;

    label {
      font-size: 0.75rem;
      background-color: var(--bgCol);

      position: absolute;
      margin-left: 0.6rem;
      padding: 0 0.2rem;

      top: -4px;
    }

    input {
      font-size: 1rem;
      outline: 0;
      padding: 1rem 0.8rem;
      width: 100%;

      border: 1px solid rgba(var(--rgbText), 0.5);
      border-radius: 0.25rem;

      background-color: var(--bgCol);

      // &:focus ~ label,
      // &:not(:placeholder-shown) ~ label {
      //   transform: translateY(-0.35rem) scale(0.75);
      //   background-color: white;
      // }
    }
  }
</style>
