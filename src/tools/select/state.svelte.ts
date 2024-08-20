import { toStore } from "svelte/store";
import { boundingBox } from "rabbit-ear/math/polygon.js";
import { type Box } from "rabbit-ear/types.js";

export const presses = (() => {
	let value: [number, number][] = $state([]);
	return {
		get value() { return value; },
		set value(v) { value = v; },
		clear() { while (value.length) { value.pop(); }},
	};
})();

export const releases = (() => {
	let value: [number, number][] = $state([]);
	return {
		get value() { return value; },
		set value(v) { value = v; },
		clear() { while (value.length) { value.pop(); }},
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

export const selectionRect = (() => {
	const value: Box | undefined = $derived.by(() => {
		if (!presses.value.length || !drag.value) { return undefined; }
		const points = [...$state.snapshot(presses.value), $state.snapshot(drag.value)];
		return boundingBox(points);
	});
	return {
		get value() { return value; },
	};
})();

const doSelection = $derived.by(() => {
	if (presses.value.length && releases.value.length) {
		const points = [
			$state.snapshot(presses.value[0]),
			$state.snapshot(releases.value[0]),
		];
		console.log("make selection", ...points);
		reset();
	}
});

const doSelectionStore = toStore(() => doSelection);

export const reset = () => {
	move.value = undefined;
	drag.value = undefined;
	presses.clear();
	releases.clear();
};

let unsub: Function[] = [];

export const subscribe = () => {
	// console.log("subscribe");
	unsub = [
		doSelectionStore.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	// console.log("unsubscribe");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
