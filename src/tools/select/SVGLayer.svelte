<script>
	import { selectionRect } from "./state.svelte.ts";
</script>

{#if selectionRect.value}
	<rect
		x={selectionRect.value.min[0]}
		y={selectionRect.value.min[1]}
		width={selectionRect.value.span[0]}
		height={selectionRect.value.span[1]}
		class="animated-dashed-line"
	/>
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
