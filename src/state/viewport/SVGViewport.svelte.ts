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
//import snap from "../snap.svelte.ts";
import type { VecLine2 } from "rabbit-ear/types.js";
import { clipLineInPolygon } from "../../general/clip.ts";

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

	uiEpsilonFactor = 0.01;
	snapRadiusFactor = 0.05;
	uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
	snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);

	constructor() {
		this.view = new SVGViewportView();
		this.style = new SVGViewportStyle(this.view);
		this.grid = new SVGGrid(this.view);
	}

	dealloc() {
		unsetViewportEvents(this);
		this.layer = undefined;
		this.props = undefined;
	}

	//snapPoint(point: [number, number]) {
	//  //return snapToPoint(point, snap.snapPoints, this.snapRadius, snap.gridSnapFunction);
	//  return snap.snapPoint(point, this.snapRadius);
	//}
	clipLine(line: VecLine2) {
		return clipLineInPolygon(line, this.view.viewBoxPolygon);
	}
}
