<script>
	import { svgShapes } from "./state.svelte.ts";
	// $inspect(svgShapes.circle);
</script>

{#if svgShapes && svgShapes.circle}
	<circle class="animated-dashed-line" {...svgShapes.circle} />
{/if}

<style>
	circle {
		fill: none;
		stroke: var(--text);
	}
	@keyframes animate-dash {
		from { stroke-dashoffset: 0; }
		to { stroke-dashoffset: calc(500pt * var(--stroke-dash-length)); }
	}
	.animated-dashed-line {
		stroke-dasharray: var(--stroke-dash-length);
		animation: 60s linear 0s infinite reverse both running animate-dash;
	}
</style>
