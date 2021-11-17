<script>
  import { canvasTools } from '../../store';

  const colors = [
    '#FFFFFF',
    '#C1C1C1',
    '#EF130B',
    '#FF7100',
    '#FFE400',
    '#00CC00',
    '#00B2FF',
    '#231FD3',
    '#A300BA',
    '#D37CAA',
    '#A0522D',
    '#000000',
    '#4C4C4C',
    '#740B07',
    '#C23800',
    '#E8A200',
    '#005510',
    '#00569E',
    '#0E0865',
    '#550069',
    '#A75574',
    '#63300D',
  ];
  $canvasTools.color = colors[11];

  const brushes = [3, 5, 10, 15, 20];
  $canvasTools.size = brushes[0];
</script>

<div class="toolbox">
  <!-- maybe further split toolbox parts -->
  <div class="toolbox__colors flex flex-row">
    <div
      class="toolbox__colorPreview w-8 h-8 mr-4 rounded"
      style={`background-color: ${$canvasTools.color}`}
    />

    <div class="toolbox__colorPicker grid grid-cols-11 w-max">
      <!-- change this to radio buttons? -->
      {#each colors as color}
        <button
          class="w-4 h-4"
          style={`background-color: ${color}`}
          on:click={() => {
            $canvasTools.color = color;
          }}
        />
      {/each}
    </div>
  </div>

  <div class="toolbox__tools">
    <!-- {#each items as item}
    {/each} -->
  </div>

  <div class="toolbox__brushes flex flex-row">
    {#each brushes as brush}
      <button
        class="w-8 h-8 grid place-items-center border border-black border-solid rounded"
        class:active={brush == $canvasTools.size}
        on:click={() => {
          $canvasTools.size = brush;
        }}
        ><div
          class="toolbox__brush rounded-full bg-black"
          style={`width: ${brush}px;height: ${brush}px`}
        /></button
      >
    {/each}
  </div>
</div>

<style>
  .active {
    background-color: #e4e4e4;
  }
</style>
