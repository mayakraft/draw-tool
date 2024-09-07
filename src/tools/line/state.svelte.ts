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
	snapPresses: [number, number][] = $state([]);
	snapReleases: [number, number][] = $state([]);

	// the above, but snapped to grid
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);

	line: VecLine2 | undefined = $derived.by(() => {
		if (this.snapPresses.length && this.snapReleases.length) {
			return pointsToLine2(this.snapPresses[0], this.snapReleases[0]);
		}
		if (this.snapPresses.length && this.snapDrag) {
			return pointsToLine2(this.snapPresses[0], this.snapDrag);
		}
		return undefined;
	});

	segmentPoints: [number, number][] | undefined = $derived.by(() => {
		if (!this.line) { return undefined; }
		if (!this.snapPresses.length || !this.snapReleases.length) { return undefined; }
		const snapLines = [{ line: this.line, clamp: (a) => a, domain: () => true }];
		const point1 = this.snapPresses.length >= 2
			? snapToLine(this.snapPresses[1], snapLines).coords
			: snapToLine(this.snapMove, snapLines).coords;
		const point2 = this.snapReleases.length >= 2
			? snapToLine(this.snapReleases[1], snapLines).coords
			: snapToLine(this.snapDrag, snapLines).coords;
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
		while (this.snapPresses.length) { this.snapPresses.pop(); }
		while (this.snapReleases.length) { this.snapReleases.pop(); }
	}

	makeLine() {
		return $effect.root(() => {
			$effect(() => {
				if (this.snapPresses.length >= 2 && this.snapReleases.length >= 2 && this.segment) {
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
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeLine());
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
