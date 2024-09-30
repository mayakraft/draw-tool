import { viewBoxOrigin } from "../../../general/matrix.ts";
import { makeSquareGrid, makeTriangleGrid } from "./grid.ts";
import { View } from "./View.svelte.ts";
import settings from "./Settings.svelte.ts";

export class Grid {
  view: View;
  #cameraOrigin = $derived.by(() => viewBoxOrigin(this.view.viewBox, true));

  #cameraViewport: [number, number, number, number] = $derived.by(() => [
    this.#cameraOrigin[0],
    this.#cameraOrigin[1],
    this.view.viewBox[2],
    this.view.viewBox[3],
  ]);

  strokeWidth = $derived.by(() => this.view.vmax / 400);

  lines = $derived.by(() => {
    switch (settings.tiling) {
      case "triangle":
        return makeTriangleGrid(this.#cameraViewport);
      case "square":
        return makeSquareGrid(this.#cameraViewport);
      default:
        return [];
    }
  });

  verticalUp: boolean = $state(true);
  constructor(view: View) {
    this.view = view;
  }
}
