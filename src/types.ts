import type { Component, ComponentType, SvelteComponentTyped } from "svelte";
import type { Viewport } from "./stores/viewport.svelte.ts";

//export type ViewportUIEvent = UIEvent & {
//  point: [number, number] | [number, number, number];
//}

export type ViewportMouseEvent = MouseEvent & {
	point: [number, number];
};

export type ViewportTouchEvent = TouchEvent & {
	point: [number, number];
};

export type ViewportWheelEvent = WheelEvent & {
	point: [number, number];
};

export interface Destroyable {
	deinitialize(): void;
};

export interface ViewportEvents {
	// touch events
	onmousemove?: (event: ViewportMouseEvent) => void;
	onmousedown?: (event: ViewportMouseEvent) => void;
	onmouseup?: (event: ViewportMouseEvent) => void;
	onmouseleave?: (event: ViewportMouseEvent) => void;
	onwheel?: (event: ViewportWheelEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
  // touch screen events
  touchstart?: (event: ViewportTouchEvent) => void;
  touchend?: (event: ViewportTouchEvent) => void;
  touchmove?: (event: ViewportTouchEvent) => void;
  touchcancel?: (event: ViewportTouchEvent) => void;
}

export abstract class UITool implements Destroyable {
	static key: string;
	static name: string;
	static icon: any;
	// static icon: Component;
	// static icon: ComponentType<SvelteComponentTyped>;

	panel?: any;
	SVGLayer?: any;
	SVGLayerProps?: any;

  // A UI tool is intended for a Viewport, a tool will be instanced once per app,
  // but may need to subinstance internal state once per viewport (one app can
  // have many viewports). This is that internal "constructor" for each viewport.
  // The return function is the deinitializer for everything made in the bindTo().
	abstract bindTo(viewport: Viewport): Function;

  // This function should clean up anything that was created/bound in the constructor.
  // This will be called when this tool is removed (during a switching of tools).
  abstract deinitialize(): void;
}

// panel can change a variable like, "snap rotation", this variable must not live inside
// of a tool's UI state because this would be instance once for each viewport and it wouldn't
// be ideal to have one "global" setting modify a bunch of instance's settings; so, a tool
// should have "global" settings and "viewport" settings.
// - viewport settings: one for each viewport
// - global settings: apply to all viewport instances.

// i didn't realize this was going to open a can of worms.
//
// creating a new tool should create one instance of the tool.
// (because there is at least an option for a global state with global settings)
// that one instance should allow you to create multiple viewport states
// where each viewport state can be created and destroyed, and has
// access to the global state object.

