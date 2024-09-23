import { viewBoxOrigin } from "../../general/matrix.ts";
import { makeSquareGrid, makeTriangleGrid } from "../../general/grid.ts";
import { SVGViewportView } from "./SVGViewportView.svelte.ts";
// import { app } from "../app.svelte.ts";

export class SVGGrid {
	view: SVGViewportView;
	#cameraOrigin = $derived.by(() => viewBoxOrigin(this.view.viewBox, true));

	#cameraViewport: [number, number, number, number] = $derived.by(() => [
		this.#cameraOrigin[0],
		this.#cameraOrigin[1],
		this.view.viewBox[2],
		this.view.viewBox[3],
	]);

	strokeWidth = $derived.by(() => this.view.vmax / 400);

	lines = $derived.by(() => {
		const tiling: string = "square";
		// switch (app.snap.tiling) {
		switch (tiling) {
			case "triangle":
				return makeTriangleGrid(this.#cameraViewport);
			case "square":
				return makeSquareGrid(this.#cameraViewport);
			default:
				return [];
		}
	});

	verticalUp: boolean = $state(true);
	constructor(view: SVGViewportView) {
		this.view = view;
	}
}
