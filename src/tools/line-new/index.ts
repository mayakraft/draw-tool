import type { UITool } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { GlobalState, ViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
	static key = "line";
	static name = "line";
	static icon = icon;

	state = new GlobalState();
	panel = undefined;

	viewportStates: ViewportState[] = [];

	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		const viewportState = new ViewportState(viewport, this.state);
		this.viewportStates.push(viewportState);
		return viewportState.deinitialize;
	}

  deinitialize() {
		this.viewportStates.forEach(state => state.deinitialize());
		this.state.deinitialize();
  }
}

export default Tool;

