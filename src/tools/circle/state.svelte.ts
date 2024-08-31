import { distance2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

const makeCircle = (p0: [number, number], p1: [number, number]): { cx: number, cy: number, r: number } => {
	const [cx, cy] = p0;
	const r = distance2(p0, p1);
	return { cx, cy, r };
};

class ToolState {
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);

	circle: { cx: number, cy: number, r: number } | undefined = $derived((
		!this.presses.length || !this.drag
			? undefined
			: makeCircle(this.presses[this.presses.length - 1], this.drag)));

	// the above, but snapped to grid
	snapMove = $derived(snapPoint(this.move));
	snapDrag = $derived(snapPoint(this.drag));
	snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords));
	snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords));

	reset() {
		// console.log("circle reset");
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}

	makeCircle() {
		return $effect.root(() => {
			$effect(() => {
				// console.log("circle (press, release)", this.presses.length, this.releases.length);
				if (!this.presses.length || !this.releases.length) { return; }
				// const circle = makeCircle(this.presses[0], this.releases[0]);
				const circle = makeCircle(
					this.presses[this.presses.length - 1],
					this.releases[this.releases.length - 1],
				);
				model.addCircle(circle.cx, circle.cy, circle.r);
				this.reset();
				// console.log("going to call reset", this.reset);
				// setTimeout(this.reset, 10);
			});
			return () => {};
		});
	}
};

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeCircle());
	}

	unsubscribe() {
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
