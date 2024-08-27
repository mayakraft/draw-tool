<script>
	import { svgShapes } from "./state.svelte.ts";
	// $inspect(svgShapes.rect);
</script>

{#if svgShapes && svgShapes.rect}
	<rect class="animated-dashed-line" {...svgShapes.rect} />
{/if}

<style>
	rect {
		fill: none;
		/* stroke: var(--text); */
		stroke: #fb4;
	}
</style>
