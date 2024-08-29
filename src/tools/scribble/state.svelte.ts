import { model } from "../../stores/model.svelte.ts";

const makePathD = (points: [number, number][]): string => {
	const start = points[0];
	if (!start) { return ""; }
	const startString = `M${start[0].toFixed(4)} ${start[1].toFixed(4)}`;
	if (points.length < 2) { return startString; }
	return startString + Array.from(Array(points.length - 1))
		.map((_, i) => i + 1)
		.map(i => `L${points[i][0].toFixed(4)} ${points[i][1].toFixed(4)}`)
		.join("");
};

class ToolState {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drags: [number, number][] = $state([]);

	// the above, but snapped to grid
	// snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords));
	// snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords));
	// snapMove = $derived(snapPoint(this.move));
	// snapDrag = $derived(snapPoint(this.drag));

	// pathD: string = $derived(makePathD(this.drags));
	pathD: string = $derived.by(() => {
		const points: [number, number][] = $state.snapshot(this.drags)
			.map(([p0, p1]) => [p0, p1]);
		return makePathD(points);
	})

	clear() {
		// console.log("clear()");
		this.move = undefined;
		// this.presses = [];
		// this.releases = [];
		// this.drags = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
		while (this.drags.length) { this.drags.pop(); }
	}

	addToModel() {
		const points: [number, number][] = $state.snapshot(this.drags)
			.map(([p0, p1]) => [p0, p1]);
		console.log("adding path to model", makePathD(points));
		model.addPath({ d: makePathD(points) });
		reset();
	}
};

export const state = new ToolState();
console.log("scribble, new ToolState()");

// class SVGShapes {
// 	box: Box | undefined = $derived((
// 		!touches.presses.length || !touches.drag
// 			? undefined
// 			: boundingBox([touches.presses[touches.presses.length - 1], touches.drag])));
// };

// export const svgShapes = new SVGShapes();
// export let svgShapes; // : SVGShapes | undefined;

export const reset = () => {
	// console.log("scribble reset");
	state.clear();
};

let unsub: Function[] = [];

export const subscribe = () => {
	// console.log("subscribe to scribble");
	unsub = [
		// $effect.root(() => {
		// 	console.log("circle effect.root initialize");
		// 	// state = new ToolState();
		// 	// touches = new TouchManager();

		// 	$effect(() => { state.addToModel(); });
		// 	return () => {
		// 		// svgShapes = undefined;
		// 		console.log("circle effect.root cleanup");
		// 	};
		// }),
	];
};

export const unsubscribe = () => {
	// console.log("unsubscribe from circle");
	unsub.forEach((u) => u());
	unsub = [];
	reset();
};
