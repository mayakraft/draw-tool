import { type Component } from "svelte";

export type Tool = {
	key: string;
	name: string;
	icon: Component;
	panel: any;
	pointerEvent?: Function;
	SVGLayer: any;
	reset?: Function;
	subscribe?: Function;
	unsubscribe?: Function;
};

export type ScaledMouseEvent = MouseEvent & {
	point: [number, number],
};

export type ScaledWheelEvent = WheelEvent & {
	// wheelDelta: number,
	point: [number, number],
};
