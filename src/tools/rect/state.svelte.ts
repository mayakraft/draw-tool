import { boundingBox } from "rabbit-ear/math/polygon.js";
import { type Box } from "rabbit-ear/types.js";
import { snapToPoint } from "../../js/snap.js";
import { model } from "../../stores/model.svelte.ts";
import {
	SnapPoints,
	SnapRadius,
	GridSnapFunction,
} from "../../stores/snap.svelte.js";

type Rect = {
	x: number,
	y: number,
	width: number,
	height: number,
};

const makeRect = (p0: [number, number], p1: [number, number]): Rect | undefined => {
	const box = boundingBox([p0, p1]);
	if (!box || !box.span) { return undefined; }
	const { span, min } = box;
	return { x: min[0], y: min[1], width: span[0], height: span[1] };
};

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

// class SVGShapes {
// 	box: Box | undefined = $derived((
// 		!touches.presses.length || !touches.drag
// 			? undefined
// 			: boundingBox([touches.presses[touches.presses.length - 1], touches.drag])));
// };

// export const svgShapes = new SVGShapes();
// export let svgShapes; // : SVGShapes | undefined;

export const SVGShapes = ((touches: TouchManager) => {
	const rect: Rect | undefined = $derived((
		!touches.presses.length || !touches.drag
			? undefined
			: makeRect(touches.presses[touches.presses.length - 1], touches.drag)));
	return {
		get rect() { return rect; },
	};
});
export let svgShapes: { rect: Rect | undefined } | undefined;

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
				$inspect(svgShapes?.rect);
				console.log("circle (press, release)", touches.presses.length, touches.releases.length);
				if (touches.presses.length && touches.releases.length) {
					// const circle = makeCircle(touches.presses[0], touches.releases[0]);
					const rect = makeRect(
						touches.presses[touches.presses.length - 1],
						touches.releases[touches.releases.length - 1],
					);
					if (rect) {
						model.addRect(rect.x, rect.y, rect.width, rect.height);
					}
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
