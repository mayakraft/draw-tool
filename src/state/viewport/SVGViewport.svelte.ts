import { unsetViewportEvents, type Viewport } from "./viewport.ts";
import type {
	ViewportEvents,
	ViewportMouseEvent,
	ViewportWheelEvent,
	ViewportTouchEvent,
} from "./events.ts";
import { SVGViewportView } from "./SVGViewportView.svelte.ts";
import { SVGViewportStyle } from "./SVGViewportStyle.svelte.ts";
import { SVGGrid } from "./SVGGrid.svelte.ts";

export class SVGViewport implements Viewport, ViewportEvents {
	view: SVGViewportView;
	style: SVGViewportStyle;
	grid: SVGGrid;

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

	layer?: any = $state();
	props?: any = $state();

	constructor() {
		this.view = new SVGViewportView();
		this.style = new SVGViewportStyle(this.view);
		this.grid = new SVGGrid(this.view);
	}

	deinitialize() {
		unsetViewportEvents(this);
		this.layer = undefined;
		this.props = undefined;
	}

	uiEpsilonFactor = 0.01;
	snapRadiusFactor = 0.05;
	uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
	snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);
}
