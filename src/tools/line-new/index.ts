import type {
	ToolNew,
	ToolViewport,
	ToolViewportInstance,
	SubUnsubReset,
} from "../../types.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import icon from "./icon.svelte";
import {
	ToolState,
	GlobalState,
	ViewportState,
	SVGViewportEvents,
} from "./state.svelte.ts";
// import * as events from "./events.ts";
// import { SVGViewportEvents } from "./events.ts";
// import SVGLayer from "./SVGLayer.svelte";

class Tool implements ToolNew {
	static key = "line";
	static name = "line";
	static icon = icon;

	state = new GlobalState();
	panel = undefined;
	// SVGLayer = SVGLayer;

	viewportStates: ViewportState[] = [];
	// viewportProps: any[] = [];
	// viewportEvents: SVGViewportEvents[] = [];

	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		const viewportState = new ViewportState(viewport, this.state);
		// const viewportEvents = new SVGViewportEvents(viewport);
		// this.viewportEvents.push(viewportEvents);
		this.viewportStates.push(viewportState);
		// subscribe, return unsubscribe
		// todo for now, not doing anything with reset
		// viewportEvents.subscribe();
		viewportState.subscribe();
		// return viewportEvents.unsubscribe;
		return viewportState.unsubscribe;
		// return () => {};
	}

	// SubUnsubReset
	subscribe() {
		this.state.subscribe();
		// viewportEvents.forEach(e => e.subscribe());
	}
	unsubscribe() {
		this.state.unsubscribe();
		// viewportEvents.forEach(e => e.unsubscribe());
	}
	// not sure we need to expose this to the outside world
	reset() {
		this.state.reset();
		// viewportEvents.forEach(e => e.reset());
	}
}

export default Tool;
