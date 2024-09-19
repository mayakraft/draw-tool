import { subtract2 } from "rabbit-ear/math/vector.js";
import type { SubUnsubReset } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import { panCameraMatrix } from "./matrix.ts";

export class ToolState {
	press: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	viewport: Viewport;

	dragVector: [number, number] = $derived(
		!this.drag || !this.press ? [0, 0] : subtract2(this.drag, this.press),
	);

	constructor(viewport: Viewport) {
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
				this.viewport.view.camera = panCameraMatrix(
					this.viewport.view.camera,
					translation,
				);
			});
			return () => {};
		});
	}
}

export class StateManager implements SubUnsubReset {
	tool: ToolState | undefined;
	unsub: Function[] = [];
	viewport: Viewport;

	constructor(viewport: Viewport) {
		this.viewport = viewport;
	}

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState(this.viewport);
		this.unsub.push(this.tool.doPan());
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	}
}
