import type { Component, ComponentType, SvelteComponentTyped } from "svelte";
import type { Viewport } from "./stores/viewport.svelte.ts";

export interface StateManagerType {
	subscribe(): void;
	unsubscribe(): void;
	reset(): void;
}

export interface SubUnsubReset {
	subscribe(): void;
	unsubscribe(): void;
	reset(): void;
}

export type ScaledMouseEvent = MouseEvent & {
	point: [number, number];
	// id?: string,
	// viewport?: Viewport,
};

export type ScaledWheelEvent = WheelEvent & {
	// wheelDelta: number,
	point: [number, number];
	// id?: string,
	// viewport?: Viewport,
};

// panel can change a variable like, "snap rotation", this variable must not live inside
// of a tool's UI state because this would be instance once for each viewport and it wouldn't
// be ideal to have one "global" setting modify a bunch of instance's settings; so, a tool
// should have "global" settings and "viewport" settings.
// - viewport settings: one for each viewport
// - global settings: apply to all viewport instances.

export type Tool = {
	key: string;
	name: string;
	// icon: Component;
	// icon: ComponentType<SvelteComponentTyped>;
	icon: any;
	panel: any;
	SVGLayer: any;
	state?: StateManagerType;
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

// type ToolViewport = { };

export interface ToolViewport {
	// SVGLayer: any;
	// touch events
	onmousemove?: (event: ScaledMouseEvent) => void;
	onmousedown?: (event: ScaledMouseEvent) => void;
	onmouseup?: (event: ScaledMouseEvent) => void;
	onmouseleave?: (event: ScaledMouseEvent) => void;
	onwheel?: (event: ScaledWheelEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
}

// i didn't realize this was going to open a can of worms.
//
// creating a new tool should create one instance of the tool.
// (because there is at least an option for a global state with global settings)
// that one instance should allow you to create multiple viewport states
// where each viewport state can be created and destroyed, and has
// access to the global state object.

// export type ToolDefinition = {
// 	key: string;
// 	name: string;
// 	// icon: Component;
// 	icon: ComponentType<SvelteComponentTyped>;
// 	panel: any;
// 	state?: SubUnsubReset;
// 	viewportInstance: ToolViewport;
// };

export interface ToolViewportInstance {}

export abstract class ToolNew implements SubUnsubReset {
	static key: string;
	static name: string;
	// static icon: Component;
	// static icon: ComponentType<SvelteComponentTyped>;
	static icon: any;

	panel?: any;
	SVGLayer?: any;
	SVGLayerProps?: any;

	// state?: SubUnsubReset;
	// viewportInstances: ToolViewportInstance[];
	abstract bindTo(viewport: Viewport): Function;
	abstract subscribe(): void;
	abstract unsubscribe(): void;
	abstract reset(): void;
}

// export interface ToolNew {
// 	// key: string;
// 	// name: string;
// 	// icon: Component;
// 	icon: ComponentType<SvelteComponentTyped>;
// 	panel: any;
// 	state?: SubUnsubReset;
// 	// viewportInstances: ToolViewportInstance[];
// 	bindTo(viewport: Viewport): Function;
// }
