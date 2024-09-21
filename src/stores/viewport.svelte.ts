import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
	makeMatrix2Translate,
	makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";
import type {
	ViewportMouseEvent,
	ViewportWheelEvent,
	ViewportTouchEvent,
	ViewportEvents,
} from "../types.ts";

class SVGViewportView {
	verticalUp = $state(
		localStorage.getItem("VerticalUp") !== null
			? localStorage.getItem("VerticalUp") === "true"
			: false,
	);

	camera = $state([...identity2x3]);

	#model = $state([...identity2x3]);
	get model() {
		return this.#model;
	}
	set model(matrix) {
		const old = this.#model;
		const scale = matrix[0] / old[0];
		const x = (matrix[4] - old[4]) / old[0];
		const y = (matrix[5] - old[5]) / old[0];
		const difference = [scale, 0, 0, scale, x, y];
		const newCamera = multiplyMatrices2(this.camera, difference);
		this.camera = newCamera;
		this.#model = matrix;
	}

	view = $derived.by(() => {
		const inverted = invertMatrix2(this.camera);
		return inverted ? inverted : [...identity2x3];
	});

	modelView = $derived(multiplyMatrices2(this.model, this.view));

	viewBox: [number, number, number, number] = $derived.by(() => {
		const m = [...this.modelView];
		// get the translation component
		const [, , , , x, y] = m;
		// remove the translation component
		m[4] = m[5] = 0;
		// multiply by unit basis vectors
		const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
		return [x, y, w, h];
	});

	vmin: number = $derived(Math.min(this.viewBox[2], this.viewBox[3]));
	vmax: number = $derived(Math.max(this.viewBox[2], this.viewBox[3]));

	viewBoxString = $derived(this.viewBox.join(" "));

	viewBoxPolygon: [number, number][] = $derived([
		[this.viewBox[0] - this.viewBox[2] * 10, this.viewBox[1] - this.viewBox[3] * 10],
		[this.viewBox[0] + this.viewBox[2] * 11, this.viewBox[1] - this.viewBox[3] * 10],
		[this.viewBox[0] + this.viewBox[2] * 11, this.viewBox[1] + this.viewBox[3] * 11],
		[this.viewBox[0] - this.viewBox[2] * 10, this.viewBox[1] + this.viewBox[3] * 11],
	]);

	resetCamera() {
		this.camera = [...identity2x3];
	}

	resetModel() {
		this.model = [...identity2x3];
	}

	reset() {
		this.resetCamera();
		this.resetModel();
	}
}

class SVGViewportStyle {
	view: SVGViewportView;
	constructor(view: SVGViewportView) {
		this.view = view;
	}

	strokeWidthFactor = $state(0.001);
	strokeWidthMin = $state(0.001);
	vertexRadiusFactor = $state(0.00666);

	circleRadius = $derived.by(
		() => Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.vertexRadiusFactor,
	);

	strokeWidth = $derived.by(() =>
		Math.max(
			this.strokeWidthMin,
			Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.strokeWidthFactor,
		),
	);

	strokeDashLength = $derived(this.strokeWidth * 8);
}

export interface Viewport {
	onmousemove?: ((e: ViewportMouseEvent) => void) | undefined;
	onmousedown?: ((e: ViewportMouseEvent) => void) | undefined;
	onmouseup?: ((e: ViewportMouseEvent) => void) | undefined;
	onmouseleave?: ((e: ViewportMouseEvent) => void) | undefined;
	onwheel?: ((e: ViewportWheelEvent) => void) | undefined;
	touchstart?: ((e: ViewportTouchEvent) => void) | undefined;
	touchend?: ((e: ViewportTouchEvent) => void) | undefined;
	touchmove?: ((e: ViewportTouchEvent) => void) | undefined;
	touchcancel?: ((e: ViewportTouchEvent) => void) | undefined;

	// epsilon and snapping

	// a UI touch event, coming from a pointer device, will have some
	// built-in error correcting (like snapping, for example), and this behavior
	// is zoom-level dependent. This is the factor out of 1 which is
	// scaled to the viewbox to get this ui-epsilon floating point error factor.
	uiEpsilonFactor: number;

	// Snapping is zoom-level dependent, this is the factor
	// (out of 1) which is scaled to the viewbox to get the snap radius.
	snapRadiusFactor: number;

	// a UI touch event, coming from a pointer device, will have some
	// built-in error correcting (like snapping, for example), and this behavior
	// is zoom-level dependent. Use this variable to get an appropriate error-
	// correcting value.
	uiEpsilon: number;

	// This is the radius of the snapping range to the
	// nearest snappable point, it is dependent upon the current view zoom.
	snapRadius: number;
}

export class SVGViewport implements Viewport, ViewportEvents {
	view: SVGViewportView;
	style: SVGViewportStyle;

	onmousemove?: (event: ViewportMouseEvent) => void;
	onmousedown?: (event: ViewportMouseEvent) => void;
	onmouseup?: (event: ViewportMouseEvent) => void;
	onmouseleave?: (event: ViewportMouseEvent) => void;
	onwheel?: (event: ViewportWheelEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
	// touch screen events
	touchstart?: (event: ViewportTouchEvent) => void;
	touchend?: (event: ViewportTouchEvent) => void;
	touchmove?: (event: ViewportTouchEvent) => void;
	touchcancel?: (event: ViewportTouchEvent) => void;

	layer?: any = $state();
	props?: any = $state();

	constructor() {
		this.view = new SVGViewportView();
		this.style = new SVGViewportStyle(this.view);
	}

	uiEpsilonFactor = 0.01;
	snapRadiusFactor = 0.05;
	uiEpsilon: number = $derived(this.view.vmax * this.uiEpsilonFactor);
	snapRadius: number = $derived(this.view.vmax * this.snapRadiusFactor);
}

class GLViewportView {
	vmax = 2;
	vmin = 2;
}

class GLViewportStyle {
	view: GLViewportView;
	constructor(view: GLViewportView) {
		this.view = view;
	}
}

export class GLViewport implements Viewport, ViewportEvents {
	view: GLViewportView;
	style: GLViewportStyle;

	onmousemove?: (event: ViewportMouseEvent) => void;
	onmousedown?: (event: ViewportMouseEvent) => void;
	onmouseup?: (event: ViewportMouseEvent) => void;
	onmouseleave?: (event: ViewportMouseEvent) => void;
	onwheel?: (event: ViewportWheelEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
	// touch screen events
	touchstart?: (event: ViewportTouchEvent) => void;
	touchend?: (event: ViewportTouchEvent) => void;
	touchmove?: (event: ViewportTouchEvent) => void;
	touchcancel?: (event: ViewportTouchEvent) => void;

	layer?: any = $state();
	props?: any = $state();

	constructor() {
		this.view = new GLViewportView();
		this.style = new GLViewportStyle(this.view);
	}

	uiEpsilonFactor = 0.01;
	snapRadiusFactor = 0.05;
	uiEpsilon: number = $derived(this.view.vmax * this.uiEpsilonFactor);
	snapRadius: number = $derived(this.view.vmax * this.snapRadiusFactor);
}
