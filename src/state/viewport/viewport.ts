import type {
	ViewportMouseEvent,
	ViewportWheelEvent,
	ViewportTouchEvent,
} from "./events.ts";

export interface Destroyable {
	deinitialize(): void;
}

export interface Viewport {
	// extends Destroyable {
	onmousemove?: ((e: ViewportMouseEvent) => void) | undefined;
	onmousedown?: ((e: ViewportMouseEvent) => void) | undefined;
	onmouseup?: ((e: ViewportMouseEvent) => void) | undefined;
	onmouseleave?: ((e: ViewportMouseEvent) => void) | undefined;
	onwheel?: ((e: ViewportWheelEvent) => void) | undefined;
	touchstart?: ((e: ViewportTouchEvent) => void) | undefined;
	touchend?: ((e: ViewportTouchEvent) => void) | undefined;
	touchmove?: ((e: ViewportTouchEvent) => void) | undefined;
	touchcancel?: ((e: ViewportTouchEvent) => void) | undefined;
	onkeydown?: ((event: KeyboardEvent) => void) | undefined;
	onkeyup?: ((event: KeyboardEvent) => void) | undefined;

	// this method will unbind all of the above events (set them to undefined)
	deinitialize: () => void;

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

export const unsetViewportEvents = (viewport: Viewport) => {
	viewport.onmousemove = undefined;
	viewport.onmousedown = undefined;
	viewport.onmouseup = undefined;
	viewport.onmouseleave = undefined;
	viewport.onwheel = undefined;
	viewport.touchstart = undefined;
	viewport.touchend = undefined;
	viewport.touchmove = undefined;
	viewport.touchcancel = undefined;
	viewport.onkeydown = undefined;
	viewport.onkeyup = undefined;
};
