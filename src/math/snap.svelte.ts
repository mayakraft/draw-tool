import { snapToPoint } from "../js/snap.ts";
import { app } from "../stores/app.svelte.ts";
import { SnapPoints, GridSnapFunction } from "../stores/snap.svelte.ts";

// there should be two levels of functions:
// - core level, like snapToPoint.
// - app level, like this wrapper snapPoint, where it hard codes app parameters
// like SnapRadius, GridSnapfunction etc..
export const snapPoint = (p: [number, number] | undefined) =>
	// todo: remove viewport hard coded
	snapToPoint(p, SnapPoints.value, app.viewports[0].snapRadius, GridSnapFunction.value);
