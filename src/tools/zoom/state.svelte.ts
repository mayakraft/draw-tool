import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { cameraMatrix } from "../../stores/viewBox.svelte.ts";
import { verticalUp } from "../../stores/viewBox.svelte.ts";

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
				cameraMatrix.value = multiplyMatrices2(
					cameraMatrix.value,
					makeMatrix2Translate(...rewrap(this.dragVector, verticalUp.value)),
				);
			});
			return () => { };
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		console.log("zoom, subscribe");
		this.tool = new ToolState();
		this.unsub.push(this.tool.doZoom());
	}

	unsubscribe() {
		console.log("zoom, unsubscribe");
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
