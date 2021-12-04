<script>
  export let size = 24;
  export let strokeWidth = 0;

  size = typeof size == Number ? `${size}px` : size;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 9 6"
  width={size}
  height={size}
  ><path fill="#21468B" d="M0 0h9v6H0z" /><path
    fill="#FFF"
    d="M0 0h9v4H0z"
  /><path fill="#AE1C28" d="M0 0h9v2H0z" /></svg
>
