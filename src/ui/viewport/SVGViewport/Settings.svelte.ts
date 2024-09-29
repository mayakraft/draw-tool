//import {
//  triangleGridSnapFunction,
//  squareGridSnapFunction,
//} from "../general/snap.ts";
// these are global view settings, single settings which apply to
// all viewports or all tools.
// for example "show grid" is a setting

// one instance per app, these settings apply to any
// and all instances of SVGViewports
class SVGViewportSettings {
  showGrid: boolean = $state(true);
  showAxes: boolean = $state(true);
  tiling: string = $state("square"); // square or triangle

  radialSnapDegrees: number = $state(22.5);
  radialSnapOffset: number = $state(0);
}

export default new SVGViewportSettings();
