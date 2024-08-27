<script lang="ts">
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import { modelElements } from "../stores/model.svelte.ts";
	import { viewBox } from "../stores/viewBox.svelte.ts";
	import { strokeWidth, strokeDashLength } from "../stores/style.svelte.ts";
	import {
		onmousemove,
		onmousedown,
		onmouseup,
		onmouseleave,
		onwheel,
	} from "../stores/touchEvents.svelte.ts";
	import { tool } from "../stores/tool.svelte.ts";

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
	{onmousemove}
	{onmousedown}
	{onmouseup}
	{onmouseleave}
	{onwheel}
	viewBox={viewBox.string}
	fill="none"
	stroke="white"
	stroke-width={strokeWidth.value}>
	<GridLayer viewBoxArray={viewBox.array} />
	<g bind:this={shapeLayer}></g>
	{#if tool && tool.value && tool.value.SVGLayer}
		{@const ToolLayer = tool.value.SVGLayer}
		<!-- distribute css variables to all children -->
		<g style={`--stroke-dash-length: ${strokeDashLength.value};`}>
			<ToolLayer />
		</g>
	{/if}
</SVGTouchCanvas>
