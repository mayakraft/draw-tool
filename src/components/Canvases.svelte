<script lang="ts">
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import { modelElements } from "../stores/model.svelte.ts";
	import { viewBox } from "../stores/viewBox.svelte.ts";

	let shapeLayer: SVGGElement;

	$effect(() => {
		while(shapeLayer.children.length) {
			shapeLayer.removeChild(shapeLayer.children[0]);
		}
		modelElements.elements.forEach(el => shapeLayer.appendChild(el));
	});
</script>

<!-- <SvgCanvas -->
<SVGTouchCanvas
	onmousemove={(e) => console.log(e.point)}
	viewBox={viewBox.string}
	fill="none"
	stroke="white"
	stroke-width="0.01">
	<!-- <GridLayer viewBoxArray={viewBox.array} /> -->
	<GridLayer viewBoxArray={viewBox.array} />
	<g bind:this={shapeLayer}></g>
</SVGTouchCanvas>
