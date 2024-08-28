import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { StateManagerType } from "../../types.ts";
import { snapToLine } from "../../js/snap.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

class ToolState {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	// the above, but snapped to grid
	snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords));
	snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords));
	snapMove = $derived(snapPoint(this.move));
	snapDrag = $derived(snapPoint(this.drag));

	line: VecLine2 | undefined = $derived.by(() => {
		if (this.presses.length && this.releases.length) {
			return pointsToLine2(this.presses[0], this.releases[0]);
		}
		if (this.presses.length && this.drag) {
			return pointsToLine2(this.presses[0], this.drag);
		}
		return undefined;
	});

	segment: [number, number][] | undefined = $derived.by(() => {
		if (!this.line) { return undefined; }
		const snapLines = [{ line: this.line, clamp: (a) => a, domain: () => true }];
		const point1Snap = this.presses.length >= 2
			? snapToLine(this.presses[1], snapLines)
			: snapToLine(this.move, snapLines);
		const point2Snap = this.releases.length >= 2
			? snapToLine(this.releases[1], snapLines)
			: snapToLine(this.drag, snapLines);
		const point1 = point1Snap.coords;
		const point2 = point2Snap.coords;
		return point1 && point2 ? [point1, point2] : undefined;
	});

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.presses = [];
		this.releases = [];
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
		this.tool = new ToolState();
		console.log("line, subscribe");
		this.unsub.push(this.tool.makeLine());
	}

	unsubscribe() {
		console.log("line, unsubscribe");
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
	}

	reset() {
		this.tool?.reset();
	};
};

export default (new StateManager());
