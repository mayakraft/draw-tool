import type { Destroyable } from "../../state/viewport/viewport.ts";
import { SVGViewport } from "../../state/viewport/SVGViewport.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

export class ViewportState implements Destroyable {
	viewport: SVGViewport;

	constructor(viewport: SVGViewport) {
		this.viewport = viewport;
		this.viewport.layer = SVGLayer;
	}

	dealloc() {}
}

export class GlobalState implements Destroyable {
	constructor() {}
	dealloc() {}
}
