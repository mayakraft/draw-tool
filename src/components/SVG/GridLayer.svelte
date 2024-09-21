<script lang="ts">
	import grid from "../../stores/grid.svelte.ts";
	import { viewBoxOrigin } from "../../js/matrix.ts";
	import {
		makeSquareGrid,
		makeTriangleGrid,
	} from "../../js/grid.ts";

	interface PropsType {
		viewBoxArray: [number, number, number, number],
	};

	let {
		viewBoxArray = [0, 0, 1, 1],
	}: PropsType = $props();

	//const origin = $derived(viewBoxOrigin(viewBoxArray, renderer.view.verticalUp));
	const origin = $derived(viewBoxOrigin(viewBoxArray, true));

	const actualViewport: [number, number, number, number] = $derived([
		origin[0],
		origin[1],
		viewBoxArray[2],
		viewBoxArray[3],
	]);
	const strokeWidth = $derived(Math.max(viewBoxArray[2], viewBoxArray[3]) / 400);
	const lines = $derived(grid.pattern === "triangle"
		? makeTriangleGrid(actualViewport)
		: makeSquareGrid(actualViewport));
</script>

<g class="grid" stroke-width={strokeWidth}>
	{#each lines as line}
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
