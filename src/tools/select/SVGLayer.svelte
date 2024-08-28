<script>
	import state from "./state.svelte.ts";
</script>

{#if state.shapes && state.shapes.rect}
	<rect class="animated-dashed-line" {...state.shapes.rect} />
{/if}

<style>
	rect {
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
