import type { UITool } from "../../types.ts";
import { SVGViewport, GLViewport, type Viewport } from "../../stores/viewport.svelte.ts";
import { GlobalState, SVGViewportState, GLViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
	static key = "line";
	static name = "line";
	static icon = icon;

	state = new GlobalState();
	panel = undefined;

	viewportStates: (SVGViewportState | GLViewportState)[] = [];

	bindTo(viewport: Viewport): Function {
		if (viewport instanceof SVGViewport) {
			const viewportState = new SVGViewportState(viewport, this.state);
			this.viewportStates.push(viewportState);
			return viewportState.deinitialize;
		} else if (viewport instanceof GLViewport) {
			const viewportState = new GLViewportState(viewport);
			this.viewportStates.push(viewportState);
			return viewportState.deinitialize;
		} else {
			return () => {};
		}
	}

	deinitialize() {
		this.viewportStates.forEach((state) => state.deinitialize());
		this.state.deinitialize();
	}
}

export default Tool;
