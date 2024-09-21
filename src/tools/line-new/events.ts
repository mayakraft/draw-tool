import type { ViewportMouseEvent, ViewportWheelEvent, ViewportEvents } from "../../types.ts";
import { ToolState, Touches } from "./state.svelte.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { wheelEventZoomMatrix } from "../zoom-new/matrix.ts";

export class SVGViewportEvents implements ViewportEvents {
	touches: Touches;
	viewport: Viewport;

	onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
	};

	onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
		this.touches.addPress(point);
	};

	onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
		this.touches.addRelease(point);
	};

	//onmouseleave = (event: ViewportMouseEvent) => {
	//	this.state.reset();
	//};

	// new plan for onwheel
	// all tools must implement the "zoomTool.onwheel?.(event);" behavior.
	// there is no longer an app-wide fallthrough that executes that method
	// if no tool wheel event exists. the tool must specify the behavior explicitly.

	onwheel = ({ point, deltaX, deltaY }: ViewportWheelEvent) => {
		wheelEventZoomMatrix(this.viewport, { point, deltaY });
	};

	constructor(viewport: Viewport, touches: Touches) {
		this.viewport = viewport;
		this.touches = touches;

		this.viewport.onmousemove = this.onmousemove;
		this.viewport.onmousedown = this.onmousedown;
		this.viewport.onmouseup = this.onmouseup;
		//this.viewport.onmouseleave = this.onmouseleave;
		this.viewport.onwheel = this.onwheel;
	}
}

