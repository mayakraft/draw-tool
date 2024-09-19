// import { type ScaledMouseEvent, type ScaledWheelEvent } from "../../types.ts";
// import { ToolState, StateManager } from "./state.svelte.ts";
// import type { Viewport } from "../../stores/viewport.svelte.ts";
// import { wheelEventZoomMatrix } from "../zoom-new/matrix.ts";

// export class SVGViewportEvents {
// 	state: StateManager;
// 	viewport: Viewport;

// 	onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
// 		if (!this.state.touches) {
// 			return;
// 		}
// 		this.state.touches.move = buttons ? undefined : point;
// 		this.state.touches.drag = buttons ? point : undefined;
// 	};

// 	onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
// 		if (!this.state.touches) {
// 			return;
// 		}
// 		this.state.touches.move = buttons ? undefined : point;
// 		this.state.touches.drag = buttons ? point : undefined;
// 		this.state.touches.addPress(point);
// 	};

// 	onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
// 		if (!this.state.touches) {
// 			return;
// 		}
// 		this.state.touches.move = buttons ? undefined : point;
// 		this.state.touches.drag = buttons ? point : undefined;
// 		this.state.touches.addRelease(point);
// 	};

// 	//onmouseleave = (event: ScaledMouseEvent) => {
// 	//	this.state.reset();
// 	//};

// 	// new plan for onwheel
// 	// all tools must implement the "zoomTool.onwheel?.(event);" behavior.
// 	// there is no longer an app-wide fallthrough that executes that method
// 	// if no tool wheel event exists. the tool must specify the behavior explicitly.

// 	onwheel = ({ point, deltaX, deltaY }: ScaledWheelEvent) => {
// 		wheelEventZoomMatrix(this.viewport, { point, deltaY });
// 	};

// 	constructor(viewport: Viewport) {
// 		this.viewport = viewport;
// 		this.viewport.onmousemove = this.onmousemove;
// 		this.viewport.onmousedown = this.onmousedown;
// 		this.viewport.onmouseup = this.onmouseup;
// 		//this.viewport.onmouseleave = this.onmouseleave;
// 		this.viewport.onwheel = this.onwheel;
// 		this.state = new StateManager(this.viewport);
// 	}

// 	// todo
// 	// possibly need the same 3 functions. where we unbind the onmouse handlers
// 	subscribe() {
// 		this.state.subscribe();
// 	}
// 	unsubscribe() {
// 		this.state.unsubscribe();
// 	}
// 	reset() {
// 		this.state.reset();
// 	}
// }
