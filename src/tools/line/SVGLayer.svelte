<script>
	import state from "./state.svelte.ts";
	// $inspect(svgShapes.rect);
</script>

{#if state.svgShapes?.rect}
	<rect class="animated-dashed-line" {...state.svgShapes.rect} />
{/if}

<style>
	rect {
		fill: none;
		/* stroke: var(--text); */
		stroke: #fb4;
	}
</style>
