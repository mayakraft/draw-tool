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
};

export const touches = new TouchManager();

const dragVector: [number, number] | undefined = $derived(
	!touches.drag || !touches.press
		? [0, 0]
		: subtract2(touches.drag, touches.press));

export const reset = () => {
	touches.move = undefined;
	touches.drag = undefined;
	touches.press = undefined;
	touches.release = undefined;
};

let unsub: Function[] = [];

export const subscribe = () => {
	// console.log("subscribe to zoom");
	unsub = [
		$effect.root(() => {
			$effect(() => {
				cameraMatrix.value = multiplyMatrices2(
					cameraMatrix.value,
					makeMatrix2Translate(...rewrap(dragVector, verticalUp.value)),
				);
			});
			// return () => {
			// 	console.log('zoom $effect cleanup');
			// };
		}),
	];
};

export const unsubscribe = () => {
	// console.log("unsubscribe to zoom");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
