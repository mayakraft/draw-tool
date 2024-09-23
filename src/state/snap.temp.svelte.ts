import {
	snapToPoint,
	triangleGridSnapFunction,
	squareGridSnapFunction,
} from "../general/snap.ts";
import { app } from "./app.svelte.ts";

// there should be two levels of functions:
// - core level, like snapToPoint.
// - app level, like this wrapper snapPoint, where it hard codes app parameters
// like SnapRadius, GridSnapfunction etc..
export const snapPoint = (p: [number, number] | undefined) =>
	// todo: remove viewport hard coded
	snapToPoint(
		p,
		app.snap.snapPoints,
		app.viewports[0].snapRadius,
		app.snap.gridSnapFunction,
	);
