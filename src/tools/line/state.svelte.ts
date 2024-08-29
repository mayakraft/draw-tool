import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { StateManagerType } from "../../types.ts";
import { snapToLine } from "../../js/snap.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

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

	line: VecLine2 | undefined = $derived.by(() => {
		if (this.presses.length && this.releases.length) {
			return pointsToLine2(this.presses[0], this.releases[0]);
		}
		if (this.presses.length && this.drag) {
			return pointsToLine2(this.presses[0], this.drag);
		}
		return undefined;
	});

	segmentPoints: [number, number][] | undefined = $derived.by(() => {
		if (!this.line) { return undefined; }
		if (!this.presses.length || !this.releases.length) { return undefined; }
		const snapLines = [{ line: this.line, clamp: (a) => a, domain: () => true }];
		const point1 = this.presses.length >= 2
			? snapToLine(this.presses[1], snapLines).coords
			: snapToLine(this.move, snapLines).coords;
		const point2 = this.releases.length >= 2
			? snapToLine(this.releases[1], snapLines).coords
			: snapToLine(this.drag, snapLines).coords;
		const result = [];
		if (point1) { result.push(point1); }
		if (point2) { result.push(point2); }
		return result;
	});

	segment: [number, number][] | undefined = $derived(
		this.segmentPoints && this.segmentPoints.length < 2
			? undefined
			: this.segmentPoints);

	reset() {
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}

	makeLine() {
		return $effect.root(() => {
			$effect(() => {
				if (this.presses.length >= 2 && this.releases.length >= 2 && this.segment) {
					const [[x1, y1], [x2, y2]] = this.segment;
					model.addLine(x1, y1, x2, y2);
					this.reset();
				}
			});
			return () => {};
		});
	};
}

class StateManager implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	constructor() {}

	subscribe() {
		console.log("line, subscribe");
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeLine());
	}

	unsubscribe() {
		console.log("line, unsubscribe");
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
