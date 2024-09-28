<script lang="ts">
	import app from "../../app/App.ts";
  import type { Component } from "svelte";
	import ViewportSVG from "../viewport/SVGViewport/ViewportSVG.svelte";
	import ViewportWebGL from "../viewport/WebGLViewport/ViewportWebGL.svelte";
	import { SVGViewport } from "../viewport/SVGViewport/SVGViewport.svelte.ts";
	import { WebGLViewport } from "../viewport/WebGLViewport/WebGLViewport.svelte.ts";

	//const ids = ["canvas-a", "canvas-b"];
  //const components: Component = $derived(app.ui.viewports.map(viewport => viewport.component));
</script>

<div class="row">
	{#each app.ui.viewports as viewport, i}
    <viewport.component {viewport} />
    {#if i < app.ui.viewports.length - 1}
      <div class="gap"></div>
    {/if}
	{/each}
</div>

<!--
<div class="row">
	{#each app.ui.viewports as viewport, i}
		{#if viewport instanceof SVGViewport}
			<ViewportSVG {viewport} id={ids[i % 2]} />
			{#if i < app.ui.viewports.length - 1}
				<div class="gap"></div>
			{/if}
		{:else if viewport instanceof WebGLViewport}
			<ViewportWebGL {viewport} />
			{#if i < app.ui.viewports.length - 1}
				<div class="gap"></div>
			{/if}
		{/if}
	{/each}
</div>
-->

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
