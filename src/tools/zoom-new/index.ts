import type { ToolNew } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import icon from "./icon.svelte";
import { ViewportState } from "./state.svelte.ts";

class Tool implements ToolNew {
	static key = "zoom";
	static name = "zoom";
	static icon = icon;
	// this tool has no global state
	// state = new StateManager();
	panel = undefined;

	// viewportEvents: SVGViewportEvents[] = [];
	viewportStates: ViewportState[] = [];
	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		const viewportState = new ViewportState(viewport);
		this.viewportStates.push(viewportState);
		// subscribe, return unsubscribe
		// todo for now, not doing anything with reset
		viewportState.subscribe();
		return viewportState.unsubscribe;
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
