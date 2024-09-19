<script lang="ts">
	import ViewportSVG from "./ViewportSVG.svelte";
	import { app } from "../stores/app.svelte.ts";

	const ids = ["canvas-a", "canvas-b"];
</script>

<div class="row">
	{#each app.viewports as viewport, i}
		<ViewportSVG {viewport} id={ids[i % 2]} />
		{#if i < app.viewports.length - 1}
			<div class="gap"></div>
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
