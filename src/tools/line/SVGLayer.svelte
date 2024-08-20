<script>
	import { presses, drag } from "./state.svelte.ts";
</script>

{#if presses.value.length && drag.value}
	<line
		x1={presses.value[0][0]}
		y1={presses.value[0][1]}
		x2={drag.value[0]}
		y2={drag.value[1]}
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
