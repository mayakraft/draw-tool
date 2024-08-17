<script>
	import Tools from "../tools/index.ts";
	import { tool } from "../stores/UI.svelte.ts";
	// import { executeCommand } from "../kernel/execute.js";
</script>

	<div class="grid-columns">
		{#each Object.values(Tools) as t}
			<button
				title={t.name}
				class={t.name}
				highlighted={tool.value && tool.value.name === t.name}
				on:click={() => { tool.value = t}}>
				{#if t.icon}
					<svelte:component this={t.icon} />
				{/if}
			</button>
		{/each}
	</div>

<style>
	/*label {
		user-select: none;
	}
	p {
		color: var(--text);
		margin: 1rem 0 0.25rem 0;
		font-style: italic;
		user-select: none;
	}
	p:first-of-type { margin-top: 0; }
	.vertical-radio {
		display: grid;
		grid-template-columns: min-content 1fr;
	}
	.vertical-radio input {
		grid-column: 1;
	}*/

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
