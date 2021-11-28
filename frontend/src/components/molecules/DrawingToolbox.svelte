<script>
  import { canvasTools } from '../../stores';
  import { Edit2Icon, Trash2Icon } from 'svelte-feather-icons';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              fill="#000"
              d="M21.46 11.187V9.825h-2.082l-6.297-6.298.566-.566L12.685 2l-8.187 8.187a2.607 2.607 0 0 0-1.775.597c-1.43 1.17-1.974 3.867-1.616 8.018l1.355-.117c-.294-3.411.093-5.177.552-6.09l.5.5.566-.566 9.92 9.92 9-9-2.262-2.262h.723Zm-.384 2.261L14 20.524l-8.958-8.957L12.12 4.49l5.335 5.335H13.33a2.027 2.027 0 0 0-1.917-1.348 2.043 2.043 0 0 0 0 4.081 2.028 2.028 0 0 0 1.926-1.373h5.476l2.261 2.262ZM11.894 11a.676.676 0 0 1-.962 0 .68.68 0 1 1 .962 0Z"
            />
          </svg>
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
