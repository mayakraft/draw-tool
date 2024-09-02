import { snapToPoint } from "../js/snap.ts";
import {
	SnapPoints,
	SnapRadius,
	GridSnapFunction,
} from "../stores/snap.svelte.ts";

// there should be two levels of functions:
// - core level, like snapToPoint.
// - app level, like this wrapper snapPoint, where it hard codes app parameters
// like SnapRadius, GridSnapfunction etc..
export const snapPoint = (p: [number, number] | undefined) => (
	snapToPoint(p, SnapPoints.value, SnapRadius.value, GridSnapFunction.value)
);
