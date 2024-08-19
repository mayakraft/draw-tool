<script lang="ts">
	import type { Snippet } from "svelte";
	import SVGCanvas from "./SVGCanvas.svelte";
	import {
		convertToViewBox,
		findInParents,
	} from "../js/dom.ts";

	type ScaledMouseEvent = MouseEvent & {
		point: [number, number],
	};

	type ScaledWheelEvent = WheelEvent & {
		wheelDelta: number,
		point: [number, number],
	};

	interface PropsType {
		svg?: SVGSVGElement,
		strokeWidth?: number,
		viewBox?: string,
		invertVertical?: boolean,
		onmousedown?: (e: ScaledMouseEvent) => void,
		onmousemove?: (e: ScaledMouseEvent) => void,
		onmouseup?: (e: ScaledMouseEvent) => void,
		onmouseleave?: (e: ScaledMouseEvent) => void,
		onwheel?: (e: WheelEvent) => void,
		children?: Snippet,
	};

	let {
		svg = $bindable(),
		viewBox,
		strokeWidth = 0.001,
		invertVertical = false,
		onmousedown: down,
		onmousemove: move,
		onmouseup: up,
		onmouseleave: leave,
		onwheel: wheel,
		children,
		...rest
	}: PropsType = $props();

	const getSVG = (e: MouseEvent): SVGSVGElement => {
		if (svg) { return svg; }
		const foundSVG = findInParents(e.target, "svg") as SVGSVGElement;
		return foundSVG;
	};

	let scale = 1;
	const unwrap = (point: [number, number]): [number, number] => [
		(1 / scale) * point[0],
		(1 / scale) * point[1] * (invertVertical ? -1 : 1),
	];

	const formatMouseEvent = (e: MouseEvent): ScaledMouseEvent => Object.assign(e, {
		// buttons: e.buttons,
		point: unwrap(convertToViewBox(getSVG(e), [e.x, e.y])),
	});

	const formatWheelEvent = (e: WheelEvent): ScaledWheelEvent => Object.assign(e, {
		// wheelDelta: e.wheelDelta,
		// wheelDelta: e.deltaMode,
		wheelDelta: e.deltaY,
		point: convertToViewBox(getSVG(e), [e.x, e.y]),
	});

	const onmousedown = (e: MouseEvent) => down ? down(formatMouseEvent(e)) : undefined;
	const onmousemove = (e: MouseEvent) => move ? move(formatMouseEvent(e)) : undefined;
	const onmouseup = (e: MouseEvent) => up ? up(formatMouseEvent(e)) : undefined;
	const onmouseleave = (e: MouseEvent) => leave ? leave(formatMouseEvent(e)) : undefined;
	const onwheel = (e: WheelEvent) => wheel ? wheel(formatWheelEvent(e)) : undefined;
</script>

<SVGCanvas
	bind:svg={svg}
	{viewBox}
	{strokeWidth}
	{invertVertical}
	{onmousedown}
	{onmousemove}
	{onmouseup}
	{onmouseleave}
	{onwheel}
	{...rest}>
	{#if children}
		{@render children()}
	{/if}
</SVGCanvas>
