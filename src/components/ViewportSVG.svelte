<script lang="ts">
import SVGTouchCanvas from "./SVG/SVGTouchCanvas.svelte";
import GridLayer from "./SVG/GridLayer.svelte";
import SVGElements from "./SVG/SVGElements.svelte";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../types.ts";
import type { Viewport } from "../stores/viewport.svelte.ts";
import { model } from "../stores/model.svelte.ts";
import { tool } from "../stores/tool.svelte.ts";
import {
	onmousemove as move,
	onmousedown as down,
	onmouseup as up,
	onmouseleave as leave,
	onwheel as wheel,
} from "../stores/touchEvents.svelte.ts";

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

const onmousedown = (e: ScaledMouseEvent) => down(Object.assign(e, { viewport }));
const onmousemove = (e: ScaledMouseEvent) => move(Object.assign(e, { viewport }));
const onmouseup = (e: ScaledMouseEvent) => up(Object.assign(e, { viewport }));
const onmouseleave = (e: ScaledMouseEvent) => leave(Object.assign(e, { viewport }));
const onwheel = (e: ScaledWheelEvent) => wheel(Object.assign(e, { viewport }));

</script>

<SVGTouchCanvas
  {id}
	{onmousemove}
	{onmousedown}
	{onmouseup}
	{onmouseleave}
	{onwheel}
	viewBox={viewport.view.viewBoxString}
	fill="none"
	stroke="white"
	stroke-width={viewport.style.strokeWidth}>
	<GridLayer viewBoxArray={viewport.view.viewBox} />
	<SVGElements elements={model.elements} />
	{#if ToolLayer}
		<g style={`--stroke-dash-length: ${viewport.style.strokeDashLength};`}>
			<ToolLayer />
		</g>
	{/if}
</SVGTouchCanvas>

<style>
</style>
