import type { Component, ComponentType, SvelteComponentTyped } from "svelte";

export type Tool = {
	key: string;
	name: string;
	// icon: Component;
	icon: ComponentType<SvelteComponentTyped>;
	panel: any;
	SVGLayer: any;
	reset?: Function;
	subscribe?: Function;
	unsubscribe?: Function;
	// touch events
	onmousemove?: Function;
	onmousedown?: Function;
	onmouseup?: Function;
	onmouseleave?: Function;
	onwheel?: Function;
};

export type ScaledMouseEvent = MouseEvent & {
	point: [number, number],
};

export type ScaledWheelEvent = WheelEvent & {
	// wheelDelta: number,
	point: [number, number],
};
