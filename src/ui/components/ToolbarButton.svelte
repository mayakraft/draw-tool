<script lang="ts">
	import type { UITool } from "../tool.ts";
	import app from "../../app/App.ts";

	const { tool }: { tool: typeof UITool } = $props();

	const highlighted = $derived(app.ui.tool?.constructor.name === tool.name
		? "highlighted"
		: undefined);

	const className = $derived([tool.name, highlighted]
		.filter(a => a !== undefined)
		.join(" "));
</script>

<button
	title={tool.name}
	class={className}
  disabled={false}
	onclick={() => { app.ui.tool = new tool(); }}>
	{#if tool.icon}
		<tool.icon></tool.icon>
	{/if}
</button>

<style>
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

	button {
		stroke: var(--text);
		fill: var(--text);
	}

	button:hover {
		stroke: var(--bright);
		fill: var(--bright);
	}

	button.highlighted {
		background-color: var(--highlight);
		stroke: var(--background-1);
		fill: var(--background-1);
	}

	button[disabled], button[disabled]:hover {
		background-color: transparent;
		stroke: var(--dim);
		fill: var(--dim);
		cursor: initial;
  }

	button:focus {
		outline-offset: -1px;
		outline: 2px solid var(--uiblue);
	}
</style>
