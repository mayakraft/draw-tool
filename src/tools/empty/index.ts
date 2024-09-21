import type { UITool } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { GlobalState, ViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
	static key = "empty";
	static name = "empty";
	static icon = icon;

	state = new GlobalState();
	panel = undefined;

	viewportStates: ViewportState[] = [];

	bindTo(viewport: Viewport): Function {
		const viewportState = new ViewportState(viewport);
		this.viewportStates.push(viewportState);
		return viewportState.deinitialize;
	}

	deinitialize() {
    this.viewportStates.forEach(state => state.deinitialize());
		this.state.deinitialize();
	}
}

export default Tool;
