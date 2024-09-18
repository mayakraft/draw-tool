import type { ToolNew, ToolViewport, ToolViewportInstance, SubUnsubReset } from "../../types.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import icon from "./icon.svelte";
import { ToolState, StateManager } from "./state.svelte.ts";
// import * as events from "./events.ts";
import { SVGViewportEvents } from "./events.ts";

class Tool implements ToolNew, SubUnsubReset {
	key = "zoom";
	name = "zoom";
	icon = icon;
	state = new StateManager();
	panel = undefined;

	viewportEvents: SVGViewportEvents[] = [];
	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		this.viewportEvents.push(new SVGViewportEvents(viewport, this.state));
		const unsub = () => { };
		return unsub;
	}

	// SubUnsubReset
	subscribe() {
		this.state.subscribe();
	}
	unsubscribe() {
		this.state.unsubscribe();
	}
	// not sure we need to expose this to the outside world
	reset() {
		this.state.reset();
	}
};

// export default { // <ToolDefinition>{
// 	key: "zoom",
// 	name: "zoom",
// 	icon,
// 	state,
// 	SVGLayer: undefined,
// 	panel: undefined,
// 	ui: ToolDef,
// };

export default Tool;
