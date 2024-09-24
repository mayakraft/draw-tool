import type { SnapResult, LineType } from "../general/snap.ts";
import {
	snapToPointOrGrid,
	snapToLineOrPointOrGrid,
	triangleGridSnapFunction,
	squareGridSnapFunction,
} from "../general/snap.ts";
import preferences from "./preferences.svelte.ts";

export class Snap {
	radialSnapDegrees: number = $state(22.5);
	radialSnapOffset: number = $state(0);
	points: [number, number][] = [];

	gridSnapFunction = $derived.by(() => {
		switch (preferences.tiling) {
			case "triangle":
				return triangleGridSnapFunction;
			case "square":
				return squareGridSnapFunction;
			default:
				return () => undefined;
		}
	});

	snapToPoint(point: [number, number], snapRadius: number): SnapResult {
		return snapToPointOrGrid(point, snapRadius, this.points, this.gridSnapFunction);
	}

	snapToLine(point: [number, number], snapRadius: number, lines: LineType[]): SnapResult {
		return snapToLineOrPointOrGrid(
			point,
			snapRadius,
			lines,
			this.points,
			this.gridSnapFunction,
		);
	}

	constructor() {}
}

export default new Snap();

// SnapPoints contains a list of 2D points in the plane which the UI
// should be able to snap to. This list notably does not contain a list of
// grid-points (snap to grid) because that list is infinite and calculated
// in the snap-point-finding method. The list of points here includes:
// - graph vertices
// - intersections between ruler lines and graph edges
// Currently, it does not include:
// - intersections between ruler lines and ruler lines
// - intersections between ruler lines and the background grid
