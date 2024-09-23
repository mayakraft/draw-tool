<script lang="ts">
	import type { VecLine2 } from "rabbit-ear/types.js";
	import { clipLineInViewBox } from "../../general/clip.ts";

	// no longer referencing any tool state data directly
	// all data is now passed through the props

	type PropsType = {
		line: VecLine2 | undefined,
		segmentPoints: [number, number][] | undefined,
		segment: [number, number][] | undefined,
	}
	let {
		line,
		segment,
		segmentPoints,
	}: PropsType = $props();

	const lineClipped = $derived(clipLineInViewBox(line));

	const svgLine = $derived.by(() => {
		if (!lineClipped) { return undefined; }
		const [[x1, y1], [x2, y2]] = lineClipped;
		return { x1, y1, x2, y2 };
	});

	const svgSegment = $derived.by(() => {
		if (!segment) { return undefined; }
		const [[x1, y1], [x2, y2]] = segment;
		return { x1, y1, x2, y2 };
	});

	const svgCircles = $derived(!segmentPoints
		? []
		: segmentPoints
			// .map(([cx, cy]) => ({ cx, cy, r: renderer.circleRadius })));
			.map(([cx, cy]) => ({ cx, cy, r: 0.02 })));
</script>

{#if svgLine}
	<line class="animated-dashed-line" {...svgLine} />
{/if}

{#if svgSegment}
	<line class="highlighted" {...svgSegment} />
{/if}

{#each svgCircles as circle}
	<circle {...circle} />
{/each}

<style>
	circle {
		fill: #fb4;
		stroke: none;
	}
	line {
		fill: none;
		stroke: var(--text);
	}
	.highlighted {
		stroke: #fb4;
		stroke-width: var(--stroke-dash-length);
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
