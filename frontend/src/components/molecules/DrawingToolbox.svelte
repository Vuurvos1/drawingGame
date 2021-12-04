<script>
  import { gameManager } from '../../stores';
  import { Edit2Icon, Trash2Icon } from 'svelte-feather-icons';

  // need a Icon index to import icons like svelte-feather-icons
  import { Bucket, Eraser } from '../atoms/custom-icons';

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
    '#63300D'
  ];
  // $gameManager.tool.color = colors[11];

  const tools = ['brush', 'erase', 'fill', 'delete'];
  // $gameManager.tool.tool = tools[0];

  const brushes = [3, 5, 10, 15, 20];
  // $gameManager.tool.size = brushes[0];
</script>

<div class="toolbox">
  <!-- maybe further split toolbox parts -->
  <div class="toolbox__colors flex flex-row">
    <div
      class="toolbox__colorPreview w-8 h-8 mr-4 rounded"
      style={`background-color: ${$gameManager.tool.color}`}
    />

    <div class="toolbox__colorPicker grid grid-cols-11 w-max">
      <!-- change this to radio buttons? -->
      {#each colors as color}
        <button
          class="w-4 h-4"
          style={`background-color: ${color}`}
          on:click={() => {
            gameManager.setBrushColor(color);
          }}
        />
      {/each}
    </div>
  </div>

  <div class="toolbox__tools">
    {#each tools as tool}
      <button
        class:active={tool == $gameManager.tool.tool}
        on:click={() => {
          gameManager.setTool(tool);
        }}
      >
        {#if tool == 'brush'}
          <Edit2Icon size="24" />
        {:else if tool == 'erase'}
          <Eraser size="24" />
        {:else if tool == 'fill'}
          <Bucket size="24" />
        {:else if tool == 'delete'}
          <Trash2Icon size="24" />
        {/if}
      </button>
    {/each}
  </div>

  <div class="toolbox__brushes flex flex-row">
    {#each brushes as brush}
      <button
        class="w-8 h-8 grid place-items-center border border-black border-solid rounded"
        class:active={brush == $gameManager.tool.size}
        on:click={() => {
          gameManager.setBrushSize(brush);
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
