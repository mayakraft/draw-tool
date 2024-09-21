import type { UITool } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { ViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
	static key = "zoom";
	static name = "zoom";
	static icon = icon;

	panel = undefined;

	viewportStates: ViewportState[] = [];

	bindTo(viewport: Viewport): Function {
		// if viewport type is SVG, do A, if WebGL, do B.
		const viewportState = new ViewportState(viewport);
		this.viewportStates.push(viewportState);
		return viewportState.deinitialize;
	}

	deinitialize() {
		this.viewportStates.forEach(state => state.deinitialize());
	}
}

export default Tool;
