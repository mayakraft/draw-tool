import { untrack } from "svelte";
import { subtract2 } from "rabbit-ear/math/vector.js";
import type { Destroyable } from "../../state/viewport/viewport.ts";
import type { SVGViewport } from "../../state/viewport/SVGViewport.svelte.ts";
import type { WebGLViewport } from "../../state/viewport/WebGLViewport.svelte.ts";
import { panCameraMatrix } from "./matrix.ts";
import { SVGViewportEvents, WebGLViewportEvents } from "./events.ts";

export class ToolState {
	press: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	viewport: SVGViewport;

	dragVector: [number, number] = $derived(
		!this.drag || !this.press ? [0, 0] : subtract2(this.drag, this.press),
	);

	constructor(viewport: SVGViewport) {
		this.viewport = viewport;
	}

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
	}

	doPan() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.dragVector) {
					return;
				}
				const translation: [number, number] = [
					this.dragVector[0],
					this.dragVector[1] * (this.viewport.view.verticalUp ? -1 : 1),
				];
				untrack(() => {
					this.viewport.view.camera = panCameraMatrix(
						this.viewport.view.camera,
						translation,
					);
				});
			});
			return () => {};
		});
	}
}

export class SVGViewportState implements Destroyable {
	viewport: SVGViewport;
	tool: ToolState;
	events: SVGViewportEvents;
	unsub: Function[] = [];

	constructor(viewport: SVGViewport) {
		this.viewport = viewport;
		this.tool = new ToolState(this.viewport);
		this.events = new SVGViewportEvents(this.viewport, this.tool);
		this.unsub.push(this.tool.doPan());
	}

	deinitialize() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.tool.reset();
	}
}

export class GLViewportState implements Destroyable {
	viewport: WebGLViewport;
	events: WebGLViewportEvents;

	constructor(viewport: WebGLViewport) {
		this.viewport = viewport;
		this.events = new WebGLViewportEvents(this.viewport);
	}

	deinitialize() {}
}

export class GlobalState implements Destroyable {
	constructor() {}
	deinitialize() {}
}
