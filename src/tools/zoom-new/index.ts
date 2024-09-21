import type { UITool } from "../../types.ts";
import { SVGViewport, GLViewport, type Viewport } from "../../stores/viewport.svelte.ts";
import { SVGViewportState, GLViewportState } from "./state.svelte.ts";
import icon from "./icon.svelte";

class Tool implements UITool {
	static key = "zoom";
	static name = "zoom";
	static icon = icon;

	panel = undefined;

	viewportStates: (SVGViewportState | GLViewportState)[] = [];

	bindTo(viewport: Viewport): Function {
		if (viewport instanceof SVGViewport) {
			const viewportState = new SVGViewportState(viewport);
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
	}
}

export default Tool;
