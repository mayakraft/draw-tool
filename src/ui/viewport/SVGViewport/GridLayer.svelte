<script lang="ts">
	import { SVGViewport } from "./SVGViewport.svelte.ts";
	let { viewport }: { viewport: SVGViewport } = $props();
</script>

<g class="grid" stroke-width={viewport.grid.strokeWidth}>
	{#each viewport.grid.lines as line}
		<line {...line} />
	{/each}

	<!-- <rect
		x={actualViewport[0]}
		y={actualViewport[1]}
		width={actualViewport[2]}
		height={actualViewport[3]}
		fill="none"
		stroke="red"
	/> -->
</g>

<style>
	line { stroke: var(--background-3); }
</style>
