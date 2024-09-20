import type { SubUnsubReset } from "../../types.ts";
import { Viewport } from "../../stores/viewport.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

export class ViewportState implements SubUnsubReset {
	viewport: Viewport;

	constructor(viewport: Viewport) {
		this.viewport = viewport;
	}

	subscribe() {
		this.viewport.layer = SVGLayer;
	}

	unsubscribe() {}

	reset() {}
}

export class GlobalState implements SubUnsubReset {
	constructor() {}
	subscribe() {}
	unsubscribe() {}
	reset() {}
}
