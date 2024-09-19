import type { ToolNew } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import icon from "./icon.svelte";
import { SVGViewportEvents } from "./events.ts";

class Tool implements ToolNew {
	static key = "zoom";
	static name = "zoom";
	static icon = icon;
	// this too has no global state
	// state = new StateManager();
	panel = undefined;

	viewportEvents: SVGViewportEvents[] = [];
	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		const viewportEvents = new SVGViewportEvents(viewport);
		this.viewportEvents.push(viewportEvents);
		// subscribe, return unsubscribe
		// todo for now, not doing anything with reset
		viewportEvents.subscribe();
		return viewportEvents.unsubscribe;
	}

	subscribe() {
		// viewportEvents.forEach(e => e.subscribe());
	}
	unsubscribe() {
		// viewportEvents.forEach(e => e.unsubscribe());
	}
	// not sure we need to expose this to the outside world
	reset() {
		// viewportEvents.forEach(e => e.reset());
	}
}

export default Tool;
