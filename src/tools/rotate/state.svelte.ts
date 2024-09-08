import { untrack } from "svelte";
import { distance2, subtract2 } from "rabbit-ear/math/vector.js";
import { clockwiseAngle2 } from "rabbit-ear/math/radial.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { UIEpsilon } from "../../stores/epsilon.svelte.ts";

const equivalent = (point1: [number, number], point2: [number, number]) => (
	distance2(point1, point2) < UIEpsilon.value * 3
);

class ToolState {
	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	// the above, but snapped to grid
	snapPresses = $derived(this.presses.map(snapPoint).map(el => el.coords)
		.filter(a => a !== undefined));
	snapReleases = $derived(this.releases.map(snapPoint).map(el => el.coords)
		.filter(a => a !== undefined));
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);

	origin: [number, number] = $state([0, 0]);
	originHighlighted: boolean = $derived.by(() => {
		if (this.drag) { return equivalent(this.origin, this.drag); }
		if (this.move) { return equivalent(this.origin, this.move); }
		return false;
	});
	originSelected: boolean = $state(false);

	startVector: [number, number] | undefined = $derived(this.presses.length
		? subtract2(this.presses[0], this.origin)
		: undefined);

	endVector: [number, number] | undefined = $derived.by(() => {
		if (this.releases.length) { return subtract2(this.releases[0], this.origin); }
		if (this.drag) { return subtract2(this.drag, this.origin); }
		return undefined;
	});

	angle: number = $derived(this.startVector && this.endVector
		? clockwiseAngle2(this.startVector, this.endVector)
		: 0);

	reset() {
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}

	doTransform() {
		return $effect.root(() => {
			$effect(() => {
				if (this.originSelected) { return; }
				if (!this.snapPresses.length || !this.snapReleases.length) {
					return;
				}
				console.log("rotate model by", this.angle);
				// execute();
				this.reset();
			});
			return () => { };
		});
	}

	selectOrigin() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.snapPresses.length) {
					this.originSelected = false;
					return;
				}
				untrack(() => this.originSelected = equivalent(this.origin, this.snapPresses[0]));
			});
			return () => { };
		});
	}

	moveOrigin() {
		return $effect.root(() => {
			$effect(() => {
				if (this.originSelected) {
					if (this.snapReleases.length) {
						this.origin = this.snapReleases[0];
						this.reset();
						return;
					}
					if (this.snapDrag) {
						this.origin = this.snapDrag;
						return;
					}
					if (this.snapDrag) {
						this.origin = this.snapDrag;
						return;
					}
				}
			});
			return () => { };
		});
	}
};

class StateWrapper implements StateManagerType {
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.tool = new ToolState();
		this.unsub.push(this.tool.doTransform());
		this.unsub.push(this.tool.selectOrigin());
		this.unsub.push(this.tool.moveOrigin());
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

export default (new StateWrapper());
