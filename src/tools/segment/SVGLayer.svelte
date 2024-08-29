<script>
	import state from "./state.svelte.ts";
</script>

{#if state.tool?.presses.length && state.tool?.drag}
	<line
		x1={state.tool.presses[0][0]}
		y1={state.tool.presses[0][1]}
		x2={state.tool.drag[0]}
		y2={state.tool.drag[1]}
		class="animated-dashed-line"
	/>
{/if}

<style>
	line {
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
