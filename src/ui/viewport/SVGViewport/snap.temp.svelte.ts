import {
  snapToPointOrGrid,
  triangleGridSnapFunction,
  squareGridSnapFunction,
} from "./snap.ts";
import app from "../../../app/App.ts";

// there should be two levels of functions:
// - core level, like snapToPoint.
// - app level, like this wrapper snapPoint, where it hard codes app parameters
// like SnapRadius, GridSnapfunction etc..
export const snapPoint = (point: [number, number] | undefined) =>
  // todo: remove viewport hard coded
  snapToPointOrGrid(
    point,
    app.ui.viewports[0].snapRadius,
    app.snap.snapPoints,
    app.snap.gridSnapFunction,
  );

