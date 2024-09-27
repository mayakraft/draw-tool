<script lang="ts">
	import { app } from "../state/app.svelte.ts";
	import { model } from "../state/model.svelte.ts";
	import { SVGViewport } from "../viewport/SVGViewport.svelte.ts";
	import { WebGLViewport } from "../viewport/WebGLViewport.svelte.ts";
	const logModel = () => { console.log($state.snapshot(model.shapes)); };
  const newSVG = () => { app.viewports.push(new SVGViewport()); };
  const newWebGL = () => { app.viewports.push(new WebGLViewport()); };
  const removeView = () => { app.viewports.pop(); };
	//<input type="checkbox" id="verticalUp" checked={renderer.view.verticalUp}/>
</script>

	<hr />
	<p>debug</p>

	<label for="verticalUp">Y axis</label>
	<button onclick={logModel}>model</button>

  <hr />
  <p>viewport</p>
	<button onclick={newSVG}>+ SVG</button>
	<button onclick={newWebGL}>+ GL</button>
	<button onclick={removeView}>- view</button>

	<hr />

<style>
	button {
		width: 100%;
		margin: 0;
		padding: 0.5rem;
	}
	p {
		margin: 0;
		padding: 0;
		opacity: 0.8;
		font-style: italic;
		font-weight: bold;
	}
</style>
