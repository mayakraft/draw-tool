<script lang="ts">
	import type { Snippet } from "svelte";

	interface PropsType {
		svg?: SVGSVGElement,
		viewBox?: string,
		invertVertical?: boolean,
		onmousedown?: (e: MouseEvent) => void,
		onmousemove?: (e: MouseEvent) => void,
		onmouseup?: (e: MouseEvent) => void,
		onmouseleave?: (e: MouseEvent) => void,
		onwheel?: (e: WheelEvent) => void,
		children?: Snippet,
	};

	let {
		svg = $bindable(),
		viewBox = "0 0 1 1",
		invertVertical = false,
		onmousedown,
		onmousemove,
		onmouseup,
		onmouseleave,
		onwheel,
		children,
		...rest
	}: PropsType = $props();

	let scale = 1;
	const matrix = $state([scale, 0, 0, invertVertical ? -scale : scale, 0, 0].join(", "));
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	role="presentation"
	bind:this={svg}
	onfocus={() => {}}
	onblur={() => {}}
	{viewBox}
	{onmousedown}
	{onmousemove}
	{onmouseup}
	{onmouseleave}
	{onwheel}
	{...rest}>
	<g class="wrapper-layer" style={`transform: matrix(${matrix})`}>
		{#if children}
			{@render children()}
		{/if}
	</g>
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
