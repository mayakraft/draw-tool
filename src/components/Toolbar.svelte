<script>
	import Tools from "../tools/index.ts";
	import { tool } from "../stores/tool.svelte.ts";
  console.log(Tools, Object.values(Tools));
</script>

<div class="grid-columns">
  {#each Object.values(Tools) as t}
    <button
      title={t.name}
      class={t.name}
      highlighted={tool.value && tool.value.name === t.name}
      onclick={() => { tool.value = t}}>
      {#if t.icon}
        <t.icon></t.icon>
      {/if}
    </button>
  {/each}
</div>

<style>
	/* button grid layout */
	.grid-columns {
		display: grid;
		grid-template-columns: 50% 50%;
		align-content: flex-start;
	}
	button {
		width: 2rem;
		height: 2rem;
		display: inline-block;
		margin: 0.15rem;
		padding: 0;
		border: 0px solid;
		border-radius: 0.25rem;
		cursor: pointer;
		background-color: transparent;
	}
	/* :global(svg) */
	button {
		stroke: var(--text);
		fill: var(--text);
	}
	button:hover {
		stroke: var(--bright);
		fill: var(--bright);
	}
	button[highlighted="true"] {
		background-color: var(--highlight);
		stroke: var(--background-1);
		fill: var(--background-1);
	}
	/* button[disabled], button[disabled]:hover {
		background-color: transparent;
		stroke: var(--dim);
		fill: var(--dim);
		cursor: initial;
	} */
	button:focus {
		outline-offset: -1px;
		outline: 2px solid var(--uiblue);
	}
</style>
