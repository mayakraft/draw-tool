import type { Destroyable } from "../../types.ts";
import { Viewport } from "../../stores/viewport.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

export class ViewportState implements Destroyable {
	viewport: Viewport;

	constructor(viewport: Viewport) {
		this.viewport = viewport;
		this.viewport.layer = SVGLayer;
	}

	deinitialize() {}
}

export class GlobalState implements Destroyable {
	constructor() {}
	deinitialize() {}
}
