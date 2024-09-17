import type { Component, ComponentType, SvelteComponentTyped } from "svelte";
import type { Viewport } from "./stores/viewport.svelte.ts";

export interface StateManagerType {
	subscribe(): void;
	unsubscribe(): void;
	reset(): void;
};

export type ScaledMouseEvent = MouseEvent & {
	point: [number, number],
	id?: string,
	viewport?: Viewport,
};

export type ScaledWheelEvent = WheelEvent & {
	// wheelDelta: number,
	point: [number, number],
	id?: string,
	viewport?: Viewport,
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
	onmousemove?: (event: ScaledMouseEvent) => void;
	onmousedown?: (event: ScaledMouseEvent) => void;
	onmouseup?: (event: ScaledMouseEvent) => void;
	onmouseleave?: (event: ScaledMouseEvent) => void;
	onwheel?: (event: ScaledWheelEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
};
