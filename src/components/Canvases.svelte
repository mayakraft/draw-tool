<script lang="ts">
	import ViewportSVG from "./ViewportSVG.svelte";
	import { viewports } from "../stores/viewport.svelte.ts";

	const ids = ["left-canvas", "right-canvas"];
</script>

<div class="row">
  {#each viewports as viewport, i}
    <ViewportSVG {viewport} id={ids[i % 2]} />
    {#if i < viewports.length - 1}
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
