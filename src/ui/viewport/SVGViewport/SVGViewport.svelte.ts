import type { Component } from "svelte";
import type { VecLine2 } from "rabbit-ear/types.js";
import type { Viewport } from "../viewport.ts";
import type {
  ViewportEvents,
  ViewportMouseEvent,
  ViewportWheelEvent,
  ViewportTouchEvent,
} from "../events.ts";
import { unsetViewportEvents } from "../viewport.ts";
import { View } from "./View.svelte.ts";
import { Style } from "./Style.svelte.ts";
import { Grid } from "./Grid.svelte.ts";
import ViewportComponent from "./Viewport.svelte";
//import snap from "../snap.svelte.ts";
import { clipLineInPolygon } from "./clip.ts";
import settings from "./Settings.svelte.ts";

export class SVGViewport implements Viewport, ViewportEvents {
  component: Component;
  view: View;
  style: Style;
  grid: Grid;

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

  static settings: typeof settings = settings;

  layer?: any = $state();
  props?: any = $state();

  uiEpsilonFactor = 0.01;
  snapRadiusFactor = 0.05;
  uiEpsilon: number = $derived.by(() => this.view.vmax * this.uiEpsilonFactor);
  snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);

  constructor() {
    this.component = ViewportComponent;
    this.view = new View();
    this.style = new Style(this.view);
    this.grid = new Grid(this.view);
  }

  dealloc() {
    unsetViewportEvents(this);
    this.layer = undefined;
    this.props = undefined;
  }

  //snapPoint(point: [number, number]) {
  //  return snapToPoint(point, snap.snapPoints, this.snapRadius, snap.gridSnapFunction);
  //  return snap.snapPoint(point, this.snapRadius);
  //}
  clipLine(line: VecLine2) {
    return clipLineInPolygon(line, this.view.viewBoxPolygon);
  }
}

