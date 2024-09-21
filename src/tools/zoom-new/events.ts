import type { ViewportMouseEvent, ViewportWheelEvent, ViewportEvents } from "../../types.ts";
import { ToolState } from "./state.svelte.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "./matrix.ts";

// class SVGViewportEvents implements ToolViewportInstance {
export class SVGViewportEvents implements ViewportEvents {
	tool: ToolState;
	viewport: Viewport;

	onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
		this.tool.move = buttons ? undefined : point;
		this.tool.drag = buttons ? point : undefined;
	};

	onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
		this.tool.move = buttons ? undefined : point;
		this.tool.drag = buttons ? point : undefined;
		this.tool.press = point;
	};

	onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
		this.tool.move = buttons ? undefined : point;
		this.tool.drag = buttons ? point : undefined;
		// this.tool.release = point;
		this.tool.reset();
	};

	// onmouseleave = (event: ViewportMouseEvent) => {
	// 	this.tool.reset();
	// };

	// new plan for onwheel
	// all tools must implement the "zoomTool.onwheel?.(event);" behavior.
	// there is no longer an app-wide fallthrough that executes that method
	// if no tool wheel event exists. the tool must specify the behavior explicitly.

	onwheel = ({ point, deltaX, deltaY }: ViewportWheelEvent) => {
		const type: string = "svg"; // this.viewport.type;
		switch (type) {
			case "svg":
				return wheelPanMatrix(this.viewport, { deltaX, deltaY });
			case "webgl":
				return wheelEventZoomMatrix(this.viewport, { point, deltaY });
			default:
				return wheelEventZoomMatrix(this.viewport, { point, deltaY });
		}
	};

	constructor(viewport: Viewport, tool: ToolState) {
		this.viewport = viewport;
		this.tool = tool;

		this.viewport.onmousemove = this.onmousemove;
		this.viewport.onmousedown = this.onmousedown;
		this.viewport.onmouseup = this.onmouseup;
		// this.viewport.onmouseleave = this.onmouseleave;
		this.viewport.onwheel = this.onwheel;
	}
}
