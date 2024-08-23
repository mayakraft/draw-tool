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

export const press = (() => {
	let value: [number, number] | undefined = $state();
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

export const release = (() => {
	let value: [number, number] | undefined = $state();
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

export const move = (() => {
	let value: [number, number] | undefined = $state();
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

export const drag = (() => {
	let value: [number, number] | undefined = $state();
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

const dragVector: [number, number] | undefined = $derived(
	!drag.value || !press.value
		? [0, 0]
		: subtract2(drag.value, press.value));

export const reset = () => {
	move.value = undefined;
	drag.value = undefined;
	press.value = undefined;
	release.value = undefined;
};

let unsub: Function[] = [];

export const subscribe = () => {
	console.log("subscribe to zoom");
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
	console.log("unsubscribe to zoom");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
