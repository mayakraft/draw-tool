import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { renderer } from "../../stores/renderer.svelte.ts";

const rewrap = (point: [number, number], invert: boolean): [number, number] => (
	[point[0], point[1] * (invert ? -1 : 1)]
);

class ToolState {
	press: [number, number] | undefined = $state();
	release: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	dragVector: [number, number] = $derived(!this.drag || !this.press
		? [0, 0]
		: subtract2(this.drag, this.press));

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
		this.release = undefined;
	}

	doZoom() {
		return $effect.root(() => {
			$effect(() => {
				renderer.view.camera = multiplyMatrices2(
					renderer.view.camera,
					makeMatrix2Translate(...rewrap(this.dragVector, renderer.view.verticalUp)),
				);
			});
			return () => { };
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.doZoom());
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	};
};

export default (new StateManager());
