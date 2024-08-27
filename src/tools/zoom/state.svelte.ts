import {
	makeMatrix2Translate,
	multiplyMatrices2,
} from "rabbit-ear/math/matrix2.js";
import { subtract2 } from "rabbit-ear/math/vector.js";
import { cameraMatrix } from "../../stores/viewBox.svelte.ts";
import { verticalUp } from "../../stores/viewBox.svelte.ts";

const rewrap = (point: [number, number], invert: boolean): [number, number] => (
	[point[0], point[1] * (invert ? -1 : 1)]
);

class TouchManager {
	press: [number, number] | undefined = $state();
	release: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	dragVector: [number, number] = $derived(!this.drag || !this.press
		? [0, 0]
		: subtract2(this.drag, this.press));
};

const state: {
	touches: TouchManager | undefined,
	subscribe: Function,
	unsubscribe: Function,
	reset: Function,
} = {};

// export const touches = new TouchManager();

// const dragVector: [number, number] | undefined = $derived(
// 	!state.touches.drag || !state.touches.press
// 		? [0, 0]
// 		: subtract2(state.touches.drag, state.touches.press));

state.reset = () => {
	if (!state.touches) { return; }
	state.touches.move = undefined;
	state.touches.drag = undefined;
	state.touches.press = undefined;
	state.touches.release = undefined;
};

let unsub: Function[] = [];

const deinit = () => {
	state.touches = undefined;
}

state.subscribe = () => {
	state.touches = new TouchManager();

	console.log("subscribe to zoom");
	unsub = [
		deinit,
		$effect.root(() => {
			$effect(() => {
				if (!state.touches) { return; }
				cameraMatrix.value = multiplyMatrices2(
					cameraMatrix.value,
					makeMatrix2Translate(...rewrap(state.touches.dragVector, verticalUp.value)),
				);
			});
			return () => {};
		}),
	];
};

state.unsubscribe = () => {
	console.log("unsubscribe to zoom");
	unsub.forEach((u) => u());
	unsub = [];
	state.reset();
};

export default state;
