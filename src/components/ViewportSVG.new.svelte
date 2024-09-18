<script lang="ts">
import SVGTouchCanvas from "./SVG/SVGTouchCanvas.svelte";
import GridLayer from "./SVG/GridLayer.svelte";
import SVGElements from "./SVG/SVGElements.svelte";
import type { Viewport } from "../stores/viewport.svelte.ts";
import { model } from "../stores/model.svelte.ts";
import { tool } from "../stores/tool.svelte.ts";

type PropsType = {
	id?: string,
	viewport: Viewport,
};

let {
  id,
  viewport,
}: PropsType = $props();

// https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
const ToolLayer = $derived(tool.value?.SVGLayer);

</script>

<SVGTouchCanvas
	onmousemove={viewport.onmousemove}
	onmousedown={viewport.onmousedown}
	onmouseup={viewport.onmouseup}
	onmouseleave={viewport.onmouseleave}
	onwheel={viewport.onwheel}
	viewBox={viewport.view.viewBoxString}
	{id}
	fill="none"
	stroke="white"
	stroke-width={viewport.style.strokeWidth}>
	<GridLayer viewBoxArray={viewport.view.viewBox} />
	<SVGElements elements={model.elements} />
	{#if ToolLayer}
		<g class="tool-layer" style={`--stroke-dash-length: ${viewport.style.strokeDashLength};`}>
			<ToolLayer />
		</g>
	{/if}
</SVGTouchCanvas>

<style>
</style>
