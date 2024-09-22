<script lang="ts">
import WebGLTouchCanvas from "./WebGL/WebGLTouchCanvas.svelte";
// import WebGLCanvas from "./WebGL/WebGLCanvas.svelte";
// import GLElements from "./WebGL/GLElements.svelte";
import type { GLViewport } from "../stores/viewport.svelte.ts";
import { model } from "../stores/model.svelte.ts";

type PropsType = {
	viewport: GLViewport,
	rest?: any[]
};

let {
	viewport,
	...rest
}: PropsType = $props();

// https://www.youtube.com/live/nMs4X8-L_yo?feature=shared&t=1667
const WebGLToolLayer = $derived(viewport.layer);
const webglToolLayerProps = $derived(viewport.props || {});

// before, the methods were bound like this
// onmousemove={viewport.onmousemove}
// i think this will not work because the actual variable changes throughout,
// UNLESS. oh wait. we can make the functions a $state rune.
// then maybe we can return the bindings to the above and it will auto-update.

</script>

<WebGLTouchCanvas
	onmousemove={(...args) => viewport.onmousemove?.(...args)}
	onmousedown={(...args) => viewport.onmousedown?.(...args)}
	onmouseup={(...args) => viewport.onmouseup?.(...args)}
	onmouseleave={(...args) => viewport.onmouseleave?.(...args)}
	onwheel={(...args) => viewport.onwheel?.(...args)}
	graph={model.fold}
	perspective={"orthographic"}
	renderStyle={"creasePattern"}
	viewMatrix={[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}
	layerNudge={0.01}
	fov={30.25}
	darkMode={true}
	frontColor={"#17F"}
	backColor={"#fff"}
	strokeWidth={0.0025}
	opacity={1}
	showFoldedFaceOutlines={true}
	showFoldedCreases={false}
	showFoldedFaces={true}
	<!-- {...rest} -->
	>
	<!-- <GridLayer viewBoxArray={viewport.view.viewBox} />
	<SVGElements elements={model.elements} />
	{#if WebGLToolLayer}
		<WebGLToolLayer class="hello-tool-layer" {...svgToolLayerProps} />
	{/if} -->
	</WebGLTouchCanvas>

<style>
</style>
