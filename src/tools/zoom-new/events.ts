import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";
import { ToolState, StateManager } from "./state.svelte.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import {
	wheelEventZoomMatrix,
	wheelPanMatrix,
} from "./matrix.ts";

// class SVGViewportEvents implements ToolViewportInstance {
export class SVGViewportEvents {
	state: StateManager;
	viewport: Viewport;

	onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.state.tool) { return; }
		this.state.tool.move = (buttons ? undefined : point);
		this.state.tool.drag = (buttons ? point : undefined);
	};

	onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.state.tool) { return; }
		this.state.tool.move = (buttons ? undefined : point);
		this.state.tool.drag = (buttons ? point : undefined);
		this.state.tool.press = point;
	};

	onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.state.tool) { return; }
		this.state.tool.move = (buttons ? undefined : point);
		this.state.tool.drag = (buttons ? point : undefined);
		// this.state.tool.release = point;
		this.state.tool.reset();
	};

	onmouseleave = (event: ScaledMouseEvent) => {
		this.state.reset();
	};

	// new plan for onwheel
	// all tools must implement the "zoomTool.onwheel?.(event);" behavior.
	// there is no longer an app-wide fallthrough that executes that method
	// if no tool wheel event exists. the tool must specify the behavior explicitly.

	onwheel = ({ point, deltaX, deltaY, id }: ScaledWheelEvent) => {
		// if (!viewport) { return; }
		switch (id) {
			case "right-canvas": return wheelPanMatrix(this.viewport, { deltaX, deltaY });
			case "left-canvas": return wheelEventZoomMatrix(this.viewport, { point, deltaY });
			default: return wheelEventZoomMatrix(this.viewport, { point, deltaY });
		}
	};

	constructor(viewport: Viewport, state: StateManager) {
		this.state = state;
		this.viewport = viewport;
		viewport.onmousemove = this.onmousemove;
		viewport.onmousedown = this.onmousedown;
		viewport.onmouseup = this.onmouseup;
		viewport.onmouseleave = this.onmouseleave;
		viewport.onwheel = this.onwheel;
	}

	// todo
	// possibly need the same 3 functions. where we unbind the onmouse handlers
	// subscribe() {}
	// unsubscribe() {}
	// reset() {}
}
