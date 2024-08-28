<script>
	import state from "./state.svelte.ts";
</script>

{#if state && state.svgShapes && state.svgShapes.rect}
	<rect {...state.svgShapes.rect} />
{/if}

<style>
	rect {
		fill: none;
		stroke: #fb4;
	}
</style>
