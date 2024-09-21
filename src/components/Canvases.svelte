<script lang="ts">
	import ViewportSVG from "./ViewportSVG.svelte";
	import ViewportGL from "./ViewportGL.svelte";
	import { app } from "../stores/app.svelte.ts";
	import { GLViewport, SVGViewport } from "../stores/viewport.svelte.ts";

	const ids = ["canvas-a", "canvas-b"];
</script>

<div class="row">
	{#each app.viewports as viewport, i}
		{#if viewport instanceof SVGViewport}
			<ViewportSVG {viewport} id={ids[i % 2]} />
			{#if i < app.viewports.length - 1}
				<div class="gap"></div>
			{/if}
		{:else if viewport instanceof GLViewport}
			<ViewportGL {viewport} />
			{#if i < app.viewports.length - 1}
				<div class="gap"></div>
			{/if}
		{/if}
	{/each}
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
