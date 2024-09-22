import type {
	ViewportMouseEvent,
	ViewportWheelEvent,
	ViewportEvents,
} from "../../types.ts";
import { ToolState } from "./state.svelte.ts";
import type { SVGViewport, GLViewport } from "../../stores/viewport.svelte.ts";
import { wheelEventZoomMatrix, wheelPanMatrix } from "./matrix.ts";
// import {
// 		vectorFromScreenLocation,
// 		rotateViewMatrix,
// 		zoomViewMatrix,
// 	} from "../../math/matrix.svelte.ts";

// export class WebGLViewportEvents implements ViewportEvents {

// 	prevVector: [number, number] | undefined;

// 	onpress(event: GLCanvasUIEvent) {
// 		event.preventDefault();
// 		const { point, vector } = event;
// 		prevVector = vector;
// 	};

// 	onmove(event: GLCanvasUIEvent) {
// 		event.preventDefault();
// 		const { point, vector } = event;
// 		const buttons = prevVector ? 1 : 0;
// 		if (buttons && prevVector && vector) {
// 			Renderer.ViewMatrix = rotateViewMatrix(perspective, Renderer.ViewMatrix, vector, prevVector);
// 			prevVector = vector;
// 		}
// 	};

// 	onrelease() {
// 		prevVector = undefined;
// 	};

// 	onscroll(event: GLCanvasUIEvent) {
// 		const { deltaY } = event;
// 		if (deltaY !== undefined) {
// 			const scrollSensitivity = 1 / 100;
// 			const delta = -deltaY * scrollSensitivity;
// 			if (Math.abs(delta) < 1e-3) { return; }
// 			Renderer.ViewMatrix = zoomViewMatrix(perspective, Renderer.ViewMatrix, delta);
// 		}
// 	};
// }
// const onmousedown = (e: MouseEvent) => onpress(formatEvent(e));
// const onmousemove = (e: MouseEvent) => {
// 	const event = formatEvent(e);
// 	cursorScreen = [e.offsetX, e.offsetY];
// 	cursorWorld = event.vector ? event.vector : [0, 0];
// 	return onmove(event);
// };
// const onmouseup = (e: MouseEvent) => onrelease(formatEvent(e));
// const ontouchstart = (e: TouchEvent) => onpress(formatTouchEvent(e));
// const ontouchmove = (e: TouchEvent) => onmove(formatTouchEvent(e));
// const ontouchend = (e: TouchEvent) => onrelease(formatTouchEvent(e));
// const onwheel = (e: WheelEvent) => onscroll(e);
// const onscroll = (event: GLCanvasUIEvent) => {
// 	const { deltaY } = event;
// 	if (deltaY !== undefined) {
// 		const scrollSensitivity = 1 / 100;
// 		const delta = -deltaY * scrollSensitivity;
// 		if (Math.abs(delta) < 1e-3) { return; }
// 		Renderer.ViewMatrix = zoomViewMatrix(perspective, Renderer.ViewMatrix, delta);
// 	}
// };
export class WebGLViewportEvents implements ViewportEvents {
	viewport: GLViewport;

	onmousemove = ({ point }: ViewportMouseEvent) => {
		console.log("webgl", point);
	};

	onmousedown = ({ point }: ViewportMouseEvent) => {
		console.log("webgl", point);
	};

	onmouseup = ({ point }: ViewportMouseEvent) => {
		console.log("webgl", point);
	};

	constructor(viewport: GLViewport) {
		this.viewport = viewport;

		this.viewport.onmousemove = this.onmousemove;
		this.viewport.onmousedown = this.onmousedown;
		this.viewport.onmouseup = this.onmouseup;
	}
}

// class SVGViewportEvents implements ToolViewportInstance {
export class SVGViewportEvents implements ViewportEvents {
	tool: ToolState;
	viewport: SVGViewport;

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

	constructor(viewport: SVGViewport, tool: ToolState) {
		this.viewport = viewport;
		this.tool = tool;

		this.viewport.onmousemove = this.onmousemove;
		this.viewport.onmousedown = this.onmousedown;
		this.viewport.onmouseup = this.onmouseup;
		// this.viewport.onmouseleave = this.onmouseleave;
		this.viewport.onwheel = this.onwheel;
	}
}
