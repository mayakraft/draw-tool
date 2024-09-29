//import {
//  triangleGridSnapFunction,
//  squareGridSnapFunction,
//} from "../general/snap.ts";
// these are global view settings, single settings which apply to
// all viewports or all tools.
// for example "show grid" is a setting

class Settings {
  //radialSnapDegrees: number = $state(22.5);
  //radialSnapOffset: number = $state(0);
  //gridSnapFunction = $derived.by(() => {
  //	switch (this.tiling) {
  //		case "triangle":
  //			return triangleGridSnapFunction;
  //		case "square":
  //			return squareGridSnapFunction;
  //		default:
  //			return () => undefined;
  //	}
  // });
}

export default (new Settings());

