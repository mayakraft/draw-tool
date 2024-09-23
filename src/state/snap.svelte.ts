import {
	snapToPoint,
	triangleGridSnapFunction,
	squareGridSnapFunction,
} from "../general/snap.ts";
// import { app } from "./app.svelte.ts";
// import grid from "./grid.svelte.ts";

// export class GridSettings {
// 	// allow custom function
// 	tiling: string = $state("square"); // square or triangle
// 	gridFunction: Function = $state(() => {});
// 	constructor() {}
// }

export class SnapSettings {
	radialSnapDegrees: number = $state(22.5);
	radialSnapOffset: number = $state(0);
	tiling: string = $state("square"); // square or triangle
	gridSnapFunction = $derived.by(() => {
		switch (this.tiling) {
			case "triangle":
				return triangleGridSnapFunction;
			case "square":
				return squareGridSnapFunction;
			default:
				return () => undefined;
		}
	});

	// SnapPoints contains a list of 2D points in the plane which the UI
	// should be able to snap to. This list notably does not contain a list of
	// grid-points (snap to grid) because that list is infinite and calculated
	// in the snap-point-finding method. The list of points here includes:
	// - graph vertices
	// - intersections between ruler lines and graph edges
	// Currently, it does not include:
	// - intersections between ruler lines and ruler lines
	// - intersections between ruler lines and the background grid
	snapPoints: [number, number][] = [];

	constructor() {}
}
