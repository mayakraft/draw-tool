import { boundingBox } from "rabbit-ear/math/polygon.js";
import type { StateManagerType } from "../../types.ts";
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

class ToolState {
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);

	// the above, but snapped to grid
	snapMove = $derived(snapPoint(this.move));
	snapDrag = $derived(snapPoint(this.drag));
	snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords));
	snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords));

	rect: Rect | undefined = $derived((
		!this.presses.length || !this.drag
			? undefined
			: makeRect(this.presses[this.presses.length - 1], this.drag)));

	reset() {
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}

	makeRect() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.presses.length || !this.releases.length) { return; }
				const rect = makeRect(
					this.presses[this.presses.length - 1],
					this.releases[this.releases.length - 1],
				);
				if (rect) {
					model.addRect(rect.x, rect.y, rect.width, rect.height);
				}
				this.reset();
				// setTimeout(this.reset, 0);
			});
			return () => { };
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		console.log("rect, subscribe");
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeRect());
	}

	unsubscribe() {
		console.log("rect, unsubscribe");
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	};
};

export default (new StateManager());
