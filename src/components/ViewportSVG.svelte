<script lang="ts">
import SVGTouchCanvas from "./SVG/SVGTouchCanvas.svelte";
import GridLayer from "./SVG/GridLayer.svelte";
import SVGElements from "./SVG/SVGElements.svelte";
import type { SVGViewport } from "../state/viewport/SVGViewport.svelte.ts";
import { model } from "../state/model.svelte.ts";

type PropsType = {
	viewport: SVGViewport,
	rest?: any[]
};

let {
  viewport,
  ...rest
}: PropsType = $props();

// https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
const SVGToolLayer = $derived(viewport.layer);
const svgToolLayerProps = $derived(viewport.props || {});

// before, the methods were bound like this
// onmousemove={viewport.onmousemove}
// i think this will not work because the actual variable changes throughout,
// UNLESS. oh wait. we can make the functions a $state rune.
// then maybe we can return the bindings to the above and it will auto-update.

</script>

<SVGTouchCanvas
	onmousemove={(...args) => viewport.onmousemove?.(...args)}
	onmousedown={(...args) => viewport.onmousedown?.(...args)}
	onmouseup={(...args) => viewport.onmouseup?.(...args)}
	onmouseleave={(...args) => viewport.onmouseleave?.(...args)}
	onwheel={(...args) => viewport.onwheel?.(...args)}
	viewBox={viewport.view.viewBoxString}
	fill="none"
	stroke="white"
	stroke-width={viewport.style.strokeWidth}
	{...rest}>
	<GridLayer {viewport} />
	<SVGElements elements={model.elements} />
	{#if SVGToolLayer}
		<g class="tool-layer" style={`--stroke-dash-length: ${viewport.style.strokeDashLength};`}>
			<SVGToolLayer class="hello-tool-layer" {viewport} {...svgToolLayerProps} />
		</g>
	{/if}
</SVGTouchCanvas>

<style>
</style>
