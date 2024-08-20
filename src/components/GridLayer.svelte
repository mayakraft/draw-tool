<script lang="ts">
	import { gridType } from "../stores/grid.svelte.ts";
	import { verticalUp } from "../stores/viewBox.svelte.ts";
	import { viewBoxOrigin } from "../js/matrix.ts";
	import {
		makeSquareGrid,
		makeTriangleGrid,
	} from "../js/grid.ts";

	interface PropsType {
		viewBoxArray: [number, number, number, number],
	};

	let {
		viewBoxArray = [0, 0, 1, 1],
	}: PropsType = $props();

	const origin = $derived(viewBoxOrigin(viewBoxArray, verticalUp.value));

	const actualViewport: [number, number, number, number] = $derived([
		origin[0],
		origin[1],
		viewBoxArray[2],
		viewBoxArray[3],
	]);
	const strokeWidth = $derived(Math.max(viewBoxArray[2], viewBoxArray[3]) / 400);
	const lines = $derived(gridType.value === "triangle"
		? makeTriangleGrid(actualViewport)
		: makeSquareGrid(actualViewport));

	$effect(() => console.log("Grid layer up", lines));

</script>

<g class="grid" stroke-width={strokeWidth}>
	<!-- <rect
		x={actualViewport[0]}
		y={actualViewport[1]}
		width={actualViewport[2]}
		height={actualViewport[3]}
		fill="none"
		stroke="red"
	/> -->

	{#each lines as line}
		<line {...line} />
	{/each}
</g>

<style>
	line { stroke: var(--background-3); }
</style>
