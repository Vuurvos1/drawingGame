<script>
  import { canvasTools } from '../../stores';
  import { Edit2Icon, Trash2Icon } from 'svelte-feather-icons';

  // need a Icon index to import icons like svelte-feather-icons
  import Bucket from '../icons/bucket.svelte'

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

  const tools = ['brush', 'erase', 'fill', 'delete'];
  $canvasTools.tool = tools[0];

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
    {#each tools as tool}
      <button
        class:active={tool == $canvasTools.tool}
        on:click={() => {
          $canvasTools.tool = tool;
        }}
      >
        {#if tool == 'brush'}
          <Edit2Icon size="24" />
        {:else if tool == 'erase'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="currentColor"
              d="M22.74 7.716 16.284 1.26a.89.89 0 0 0-1.257 0L5 11.287 12.713 19 22.74 8.973a.89.89 0 0 0 0-1.257ZM3.785 13l-2.541 2.541a.832.832 0 0 0 0 1.176l6.038 6.04a.832.832 0 0 0 1.177 0L11 20.215 3.785 13Z"
            />
          </svg>
        {:else if tool == 'fill'}
          <Bucket size="sm" />
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
