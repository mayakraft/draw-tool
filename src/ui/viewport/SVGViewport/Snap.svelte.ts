import type { SnapResult, LineType } from "./snap.ts";
import type { View } from "./View.svelte.ts";
import {
  snapToPointOrGrid,
  snapToLineOrPointOrGrid,
  triangleGridSnapFunction,
  squareGridSnapFunction,
} from "./snap.ts";
import settings from "./Settings.svelte.ts";
import app from "../../../app/App.svelte.ts";

export class Snap {
  view: View;

  // Snapping is zoom-level dependent, this is the factor
  // (out of 1) which is scaled to the viewbox to get the snap radius.
  snapRadiusFactor = 0.05;

  // This is the radius of the snapping range to the
  // nearest snappable point, it is dependent upon the current view zoom.
  snapRadius: number = $derived.by(() => this.view.vmax * this.snapRadiusFactor);

  points: [number, number][] = $state([]);

  #snapPoints: [number, number][] = $derived(([] as [number, number][])
    .concat(this.points)
    .concat(app.model.snapPoints));

  gridSnapFunction = $derived.by(() => {
    switch (settings.tiling) {
      case "triangle":
        return triangleGridSnapFunction;
      case "square":
        return squareGridSnapFunction;
      default:
        return () => undefined;
    }
  });

  snapToPoint(point: [number, number]): SnapResult {
    return snapToPointOrGrid(point, this.snapRadius, this.#snapPoints, this.gridSnapFunction);
  }

  snapToLine(point: [number, number], lines: LineType[]): SnapResult {
    return snapToLineOrPointOrGrid(
      point,
      this.snapRadius,
      lines,
      this.#snapPoints,
      this.gridSnapFunction,
    );
  }

  constructor(view: View) {
    this.view = view;
  }
}

