import { boundingBox } from "rabbit-ear/math/polygon.js";
import { model } from "../../stores/model.svelte.ts";
import { snapPoint } from "../../math/snap.svelte.ts";

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
		this.presses = [];
		this.releases = [];
		// while (this.presses.length) { this.presses.pop(); }
		// while (this.releases.length) { this.releases.pop(); }
	}
};

const SVGShapes = ((touches: TouchManager) => {
	const rect: Rect | undefined = $derived((
		!touches.presses.length || !touches.drag
			? undefined
			: makeRect(touches.presses[touches.presses.length - 1], touches.drag)));
	return {
		get rect() { return rect; },
	};
});

const state: { touches: TouchManager | undefined, svgShapes: any } = {
	touches: undefined,
	svgShapes: undefined,
};

export const reset = () => {
	state.touches?.clear();
};

const MakeRect = ((touches: TouchManager) => ($effect.root(() => {
	$effect(() => {
		// console.log("rect (press, release)", touches.presses.length, touches.releases.length);
		if (!touches.presses.length || !touches.releases.length) { return; }
		const rect = makeRect(
			touches.presses[touches.presses.length - 1],
			touches.releases[touches.releases.length - 1],
		);
		if (rect) {
			model.addRect(rect.x, rect.y, rect.width, rect.height);
		}
		setTimeout(reset, 0);
	});
	return () => { };
})));

let unsub: Function[] = [];

const deinit = () => {
	state.touches = undefined;
	state.svgShapes = undefined;
	console.log("rect, state.touches = undefined");
	console.log("rect, state.svgShapes = undefined");
};

export const subscribe = () => {
	state.touches = new TouchManager();
	state.svgShapes = SVGShapes(state.touches);
	console.log("rect, new TouchManager()");
	console.log("rect, SVGShapes()");
	unsub = [MakeRect(state.touches), deinit];
};

export const unsubscribe = () => {
	// console.log("unsubscribe from rect");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};

export default state;
