<script lang="ts">
	import SVGTouchCanvas from "./SVGTouchCanvas.svelte";
	import GridLayer from "./GridLayer.svelte";
	import { model, shapeToElement } from "../stores/model.svelte.ts";
	import { renderer } from "../stores/renderer.svelte.ts";
	import {
		onmousemove,
		onmousedown,
		onmouseup,
		onmouseleave,
		onwheel,
	} from "../stores/touchEvents.svelte.ts";
	import { tool } from "../stores/tool.svelte.ts";

	let shapeLayer1: SVGGElement;
	let shapeLayer2: SVGGElement;

	const remove = (el: Element) => {
		while(el.children.length) { el.removeChild(el.children[0]); }
	};

	const elements1 = $derived(model.elements
		.map(shapeToElement)
		.filter(a => a !== undefined));
	const elements2 = $derived(model.elements
		.map(shapeToElement)
		.filter(a => a !== undefined));

	$effect(() => {
		remove(shapeLayer1);
		elements1.forEach(el => shapeLayer1.appendChild(el));
	});
	$effect(() => {
		remove(shapeLayer2);
		elements2.forEach(el => shapeLayer2.appendChild(el));
	});
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
		<g bind:this={shapeLayer1}></g>
		{#if tool && tool.value && tool.value.SVGLayer}
			<!-- https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667 -->
			{@const ToolLayer = tool.value.SVGLayer}
			<!-- distribute css variables to all children -->
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
		<g bind:this={shapeLayer2}></g>
		{#if tool && tool.value && tool.value.SVGLayer}
			<!-- https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667 -->
			{@const ToolLayer = tool.value.SVGLayer}
			<!-- distribute css variables to all children -->
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
