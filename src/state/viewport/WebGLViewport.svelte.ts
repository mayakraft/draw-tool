import { identity4x4 } from "rabbit-ear/math/matrix4.js";
import { unsetViewportEvents, type Viewport } from "./viewport.ts";
import type {
	ViewportEvents,
	ViewportMouseEvent,
	ViewportWheelEvent,
	ViewportTouchEvent,
} from "./events.ts";

class WebGLViewportView {
	projectionMatrix: number[] = $state([...identity4x4]);
	viewMatrix: number[] = $state([...identity4x4]);
	modelMatrix: number[] = $state([...identity4x4]);
	canvasSize: [number, number] = $state([0, 0]);
	perspective: string = $state("perspective");

	vmax = 2;
	vmin = 2;
}

class WebGLViewportStyle {
	view: WebGLViewportView;
	constructor(view: WebGLViewportView) {
		this.view = view;
	}
}

export class WebGLViewport implements Viewport, ViewportEvents {
	view: WebGLViewportView;
	style: WebGLViewportStyle;

	onmousemove?: (event: ViewportMouseEvent) => void;
	onmousedown?: (event: ViewportMouseEvent) => void;
	onmouseup?: (event: ViewportMouseEvent) => void;
	onmouseleave?: (event: ViewportMouseEvent) => void;
	onwheel?: (event: ViewportWheelEvent) => void;
	touchstart?: (event: ViewportTouchEvent) => void;
	touchend?: (event: ViewportTouchEvent) => void;
	touchmove?: (event: ViewportTouchEvent) => void;
	touchcancel?: (event: ViewportTouchEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;

	// layer?: any = $state();
	// props?: any = $state();

	constructor() {
		this.view = new WebGLViewportView();
		this.style = new WebGLViewportStyle(this.view);
	}

	deinitialize() {
		unsetViewportEvents(this);
		// todo
	}

	uiEpsilonFactor = 0.01;
	snapRadiusFactor = 0.05;
	uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
	snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);
}
