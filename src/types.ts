import type { Component, ComponentType, SvelteComponentTyped } from "svelte";

export interface StateManagerType {
	subscribe(): void;
	unsubscribe(): void;
	reset(): void;
};

export type Tool = {
	key: string;
	name: string;
	// icon: Component;
	icon: ComponentType<SvelteComponentTyped>;
	panel: any;
	SVGLayer: any;
	state?: StateManagerType,
	// touch events
	onmousemove?: Function;
	onmousedown?: Function;
	onmouseup?: Function;
	onmouseleave?: Function;
	onwheel?: Function;
};

export type ScaledMouseEvent = MouseEvent & {
	point: [number, number],
	id?: string,
};

export type ScaledWheelEvent = WheelEvent & {
	// wheelDelta: number,
	point: [number, number],
	id?: string,
};
