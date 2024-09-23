import type { UITool } from "../../state/tool.ts";
import { SVGViewport } from "../../state/viewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "../../state/viewport/WebGLViewport.svelte.ts";
import type { Viewport } from "../../state/viewport/viewport.ts";
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
		} else if (viewport instanceof WebGLViewport) {
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
