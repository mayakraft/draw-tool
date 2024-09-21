import type { Destroyable } from "../../types.ts";
import { SVGViewport } from "../../stores/viewport.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

export class ViewportState implements Destroyable {
	viewport: SVGViewport;

	constructor(viewport: SVGViewport) {
		this.viewport = viewport;
		this.viewport.layer = SVGLayer;
	}

	deinitialize() {}
}

export class GlobalState implements Destroyable {
	constructor() {}
	deinitialize() {}
}
