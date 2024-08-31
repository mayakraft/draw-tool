import { renderer } from "./renderer.svelte.ts";
import { gridType } from "./grid.svelte.ts";
import {
	triangleGridSnapFunction,
	squareGridSnapFunction,
} from "../js/snap.ts";

/**
 * @description Establish the angle between snapping lines, and the
 * offset from 0deg for the initial line.
 */
export const RadialSnapDegrees = (() => {
	const value = $state(22.5);
	return {
		get value() { return value; },
	};
})();

export const RadialSnapOffset = (() => {
	const value = $state(0);
	return {
		get value() { return value; },
	};
})();

/**
 * @description SnapPoints contains a list of 2D points
 * in the plane which the UI should be able to snap to.
 * This list notably does not contain a list of grid-points
 * (snap to grid) because that list is infinite and calculated
 * in the snap-point-finding method.
 * The list of points here includes:
 * - graph vertices
 * - intersections between ruler lines and graph edges
 * Currently, it does not include:
 * - intersections between ruler lines and ruler lines
 * - intersections between ruler lines and the background grid
 */
// export const SnapPointsModel = derived(
// 	[CreasePattern, RulerPointsCP],
// 	([$CreasePattern, $RulerPointsCP]) => [
// 		...($CreasePattern.vertices_coords || []),
// 		...$RulerPointsCP,
// 	],
// 	[],
// );
export const SnapPoints = (() => {
	// const value = $derived();
	const value: [number, number][] = [];
	return {
		get value() { return value; },
	};
})();

/**
 * @description Snapping is zoom-level dependent, this is the factor
 * (out of 1) which is scaled to the viewbox to get the snap radius.
 */
const SnapRadiusFactor = 0.05;

/**
 * @description This is the radius of the snapping range to the
 * nearest snappable point, it is dependent upon the current view zoom.
 */
export const SnapRadius = (() => {
	const value = $derived(Math.max(renderer.view.viewBox[2], renderer.view.viewBox[3]) * SnapRadiusFactor);
	return {
		get value() { return value; },
	};
})();

/**
 *
 */
export const GridSnapFunction = (() => {
	const value = $derived(gridType.value === "triangle"
		? triangleGridSnapFunction
		: squareGridSnapFunction);
	return {
		get value() { return value; },
	};
})();
