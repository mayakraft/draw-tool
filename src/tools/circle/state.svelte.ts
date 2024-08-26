import { distance2 } from "rabbit-ear/math/vector.js";
import { snapToPoint } from "../../js/snap.js";
import { model } from "../../stores/model.svelte.ts";
import {
	SnapPoints,
	SnapRadius,
	GridSnapFunction,
} from "../../stores/snap.svelte.js";

// there should be two levels of functions:
// - core level, like snapToPoint.
// - app level, like this wrapper snapPoint, where it hard codes app parameters
// like SnapRadius, GridSnapfunction etc..
const snapPoint = (p: [number, number] | undefined) => (
	snapToPoint(p, SnapPoints, SnapRadius, GridSnapFunction.value)
);

class TouchManager {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	// the above, but snapped to grid
	snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords));
	snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords));
	snapMove = $derived(snapPoint(this.move));
	snapDrag = $derived(snapPoint(this.drag));

	clear() {
		console.log("clear()");
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}
};

// class ToolState {
// 	touches: TouchManager;
// 	constructor() {
// 		this.touches = new TouchManager();
// 	}
// }

// export const touches: TouchManager; // = new TouchManager();
export const touches = new TouchManager();

const makeCircle = (p0: [number, number], p1: [number, number]): { cx: number, cy: number, r: number } => {
	const [cx, cy] = p0;
	const r = distance2(p0, p1);
	return { cx, cy, r };
};

// class SVGShapes {
// 	circle: { cx: number, cy: number, r: number } | undefined = $derived((
// 		!touches.presses.length || !touches.drag
// 			? undefined
// 			: makeCircle(touches.presses[touches.presses.length - 1], touches.drag)));
// };

// export const svgShapes = new SVGShapes();

// export const svgShapes = (() => {
export const SVGShapes = ((touches: TouchManager) => {
	const circle: { cx: number, cy: number, r: number } | undefined = $derived((
		!touches.presses.length || !touches.drag
			? undefined
			: makeCircle(touches.presses[touches.presses.length - 1], touches.drag)));
	return {
		get circle() { return circle; },
	};
});
// export let svgShapes; // : SVGShapes | undefined;
export let svgShapes: { circle: { cx: number, cy: number, r: number } | undefined } | undefined;

export const reset = () => {
	console.log("circle reset");
	touches.clear();
};

let unsub: Function[] = [];

export const subscribe = () => {
	console.log("subscribe to circle");
	unsub = [
		$effect.root(() => {
			console.log("circle effect.root initialize");
			svgShapes = SVGShapes(touches);
			// touches = new TouchManager();

			$effect(() => {
				$inspect(svgShapes?.circle);
				console.log("circle (press, release)", touches.presses.length, touches.releases.length);
				if (touches.presses.length && touches.releases.length) {
					// const circle = makeCircle(touches.presses[0], touches.releases[0]);
					const circle = makeCircle(
						touches.presses[touches.presses.length - 1],
						touches.releases[touches.releases.length - 1],
					);
					model.addCircle(circle.cx, circle.cy, circle.r);
					reset();
				}
			});
			return () => {
				svgShapes = undefined;
				console.log("circle effect.root cleanup");
			};
		}),
	];
};

export const unsubscribe = () => {
	console.log("unsubscribe from circle");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
