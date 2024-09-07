<script lang="ts">
	import SVGTouchCanvas from "./SVG/SVGTouchCanvas.svelte";
	import GridLayer from "./SVG/GridLayer.svelte";
	import SVGElements from "./SVG/SVGElements.svelte";
	import { model } from "../stores/model.svelte.ts";
	import { tool } from "../stores/tool.svelte.ts";
	import { renderer } from "../stores/renderer.svelte.ts";
	import {
		onmousemove,
		onmousedown,
		onmouseup,
		onmouseleave,
		onwheel,
	} from "../stores/touchEvents.svelte.ts";

	// https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
	const ToolLayer = $derived(tool.value?.SVGLayer);
</script>

<div class="row">
	<SVGTouchCanvas
		id="left-canvas"
		{onmousemove}
		{onmousedown}
		{onmouseup}
		{onmouseleave}
		{onwheel}
		viewBox={renderer.view.viewBoxString}
		fill="none"
		stroke="white"
		stroke-width={renderer.strokeWidth}>
		<GridLayer viewBoxArray={renderer.view.viewBox} />
		<SVGElements elements={model.elements} />
		{#if ToolLayer}
			<g style={`--stroke-dash-length: ${renderer.strokeDashLength};`}>
				<ToolLayer />
			</g>
		{/if}
	</SVGTouchCanvas>

	<div class="gap"></div>

	<SVGTouchCanvas
		id="right-canvas"
		{onmousemove}
		{onmousedown}
		{onmouseup}
		{onmouseleave}
		{onwheel}
		viewBox={renderer.view.viewBoxString}
		fill="none"
		stroke="white"
		stroke-width={renderer.strokeWidth}>
		<GridLayer viewBoxArray={renderer.view.viewBox} />
		<SVGElements elements={model.elements} />
		{#if ToolLayer}
			<g style={`--stroke-dash-length: ${renderer.strokeDashLength};`}>
				<ToolLayer />
			</g>
		{/if}
	</SVGTouchCanvas>
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		height: 100%;
	}
	.gap {
		width: 3px;
		background-color: #999;
	}
</style>
