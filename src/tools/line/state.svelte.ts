import { boundingBox } from "rabbit-ear/math/polygon.js";
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

const SVGShapes = ((touches: TouchManager) => {
	const rect: Rect | undefined = $derived((
		!touches.presses.length || !touches.drag
			? undefined
			: makeRect(touches.presses[touches.presses.length - 1], touches.drag)));
	return {
		get rect() { return rect; },
	};
});

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
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}
};

class ToolState {
	touches: TouchManager | undefined;
	svgShapes: { rect: Rect | undefined } | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		this.touches = new TouchManager();
		console.log("line, new TouchManager()");
		this.svgShapes = SVGShapes(this.touches);
		console.log("line, SVGShapes()");

		// console.log("subscribe to rect");
		this.unsub = [
			$effect.root(() => {
				$effect(() => {
					if (!this.touches) {
						console.log("BAD BAD");
						return;
					}
					// $inspect(svgShapes?.rect);
					// console.log("rect (press, release)", touches.presses.length, touches.releases.length);
					if (this.touches.presses.length && this.touches.releases.length) {
						// const rect = makeCircle(this.touches.presses[0], this.touches.releases[0]);
						const rect = makeRect(
							this.touches.presses[this.touches.presses.length - 1],
							this.touches.releases[this.touches.releases.length - 1],
						);
						if (rect) {
							model.addRect(rect.x, rect.y, rect.width, rect.height);
						}
						this.reset();
					}
				});
				return () => {
					this.touches = undefined;
					console.log("line, this.touches = undefined");
					this.svgShapes = undefined;
					console.log("line, this.svgShapes = undefined");
					// console.log("rect effect.root cleanup");
				};
			}),
		];
	}

	unsubscribe() {
		// console.log("unsubscribe from rect");
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
	}

	reset() {
		// console.log("rect reset");
		this.touches?.clear();
	};
};

export default new ToolState();
