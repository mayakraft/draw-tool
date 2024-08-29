import { toStore } from "svelte/store";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

export const presses = (() => {
	let value: [number, number][] = $state([]);
	const snap = $derived(value
		.map(p => snapPoint(p).coords));
	return {
		get value() { return value; },
		set value(v) { value = v; },
		clear() { while (value.length) { value.pop(); }},
		get snap() { return snap; },
	};
})();

export const releases = (() => {
	let value: [number, number][] = $state([]);
	const snap = $derived(value
		.map(p => snapPoint(p).coords));
	return {
		get value() { return value; },
		set value(v) { value = v; },
		clear() { while (value.length) { value.pop(); }},
		get snap() { return snap; },
	};
})();

export const move = (() => {
	let value: [number, number] | undefined = $state();
	/** @type {{ coords: [number, number], snap: boolean }} */
	const snap = $derived(snapPoint(value));
	const coords = $derived(snap.coords);
	return {
		get value() { return value; },
		set value(v) { value = v; },
		get snap() { return snap; },
		get coords() { return coords; },
	};
})();

export const drag = (() => {
	let value: [number, number] | undefined = $state();
	/** @type {{ coords: [number, number], snap: boolean }} */
	const snap = $derived(snapPoint(value));
	const coords = $derived(snap.coords);
	return {
		get value() { return value; },
		set value(v) { value = v; },
		get snap() { return snap; },
		get coords() { return coords; },
	};
})();

const addSegment = $derived.by(() => {
	// console.log(presses.value.length, releases.value.length);
	if (presses.value.length && releases.value.length) {
		const points = [
			$state.snapshot(presses.value[0]),
			$state.snapshot(releases.value[0]),
		];
		// console.log("segment", ...points);
		model.addLine(points[0][0], points[0][1], points[1][0], points[1][1]);
		// executeCommand("segment", [$Press1Coords, $Release1Coords]);
		reset();
	}
});

const addSegmentStore = toStore(() => addSegment);

export const reset = () => {
	// console.log("reset");
	move.value = undefined;
	drag.value = undefined;
	// console.log("before");
	// console.log(presses);
	// presses.value = [];
	// releases.value = [];
	presses.clear();
	releases.clear();
	// console.log("after");
	// console.log(presses);
};

let unsub: Function[] = [];

export const subscribe = () => {
	// console.log("subscribe");
	unsub = [
		addSegmentStore.subscribe(() => {}),
	];
};

export const unsubscribe = () => {
	// console.log("unsubscribe");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
