import { untrack } from "svelte";
import { distance2, magnitude2, subtract2 } from "rabbit-ear/math/vector.js";
import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { UIEpsilon } from "../../stores/epsilon.svelte.ts";

const equivalent = (point1: [number, number], point2: [number, number]) => (
	distance2(point1, point2) < UIEpsilon.value * 3
);

class Touches {
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

	reset() {
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}
}

class FixedPoint {
	touches: Touches;

	origin: [number, number] = $state([0, 0]);
	selected: boolean = $state(false);
	highlighted: boolean = $derived.by(() => {
		if (this.touches.snapDrag) { return equivalent(this.origin, this.touches.snapDrag); }
		if (this.touches.snapMove) { return equivalent(this.origin, this.touches.snapMove); }
		return false;
	});

	constructor(touches: Touches) {
		this.touches = touches;
	}

	reset() {
		this.touches.reset();
	}

	selectOrigin() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.touches.snapPresses.length) {
					this.selected = false;
					return;
				}
				untrack(() => this.selected = equivalent(this.origin, this.touches.snapPresses[0]));
			});
			return () => { };
		});
	}

	moveOrigin() {
		return $effect.root(() => {
			$effect(() => {
				if (this.selected) {
					if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
						this.origin = this.touches.snapReleases[0];
						this.reset();
						return;
					}
					if (this.touches.snapDrag) {
						this.origin = this.touches.snapDrag;
						return;
					}
					if (this.touches.snapMove) {
						this.origin = this.touches.snapMove;
						return;
					}
				}
			});
			return () => { };
		});
	}
};

class ToolState {
	touches: Touches;
	fixedPoint: FixedPoint;

	// startVector: [number, number] | undefined = $derived(this.touches && this.touches.presses.length
	// 	? subtract2(this.touches.presses[0], this.fixedPoint.origin)
	// 	: undefined);
	startVector: [number, number] | undefined = $derived.by(() => {
		return this.touches && this.touches.snapPresses.length
			? subtract2(this.touches.snapPresses[0], this.fixedPoint.origin)
			: undefined;
	});

	endVector: [number, number] | undefined = $derived.by(() => {
		if (this.touches.snapReleases.length) { return subtract2(this.touches.snapReleases[0], this.fixedPoint.origin); }
		if (this.touches.snapDrag) { return subtract2(this.touches.snapDrag, this.fixedPoint.origin); }
		return undefined;
	});

	scale: number = $derived(this.startVector && this.endVector
		? magnitude2(this.endVector) / magnitude2(this.startVector)
		: 1);

	constructor(touches: Touches, fixedPoint: FixedPoint) {
		this.touches = touches;
		this.fixedPoint = fixedPoint;
	}

	reset() {
		this.touches.reset();
	}

	doTransform() {
		return $effect.root(() => {
			$effect(() => {
				if (this.fixedPoint.selected) { return; }
				if (!this.touches.snapPresses.length || !this.touches.snapReleases.length) {
					return;
				}
				console.log("scale model by", this.scale);
				this.reset();
			});
			return () => { };
		});
	}
};

class StateWrapper implements StateManagerType {
	touches: Touches | undefined;
	fixedPoint: FixedPoint | undefined;
	tool: ToolState | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.unsubscribe();
		this.touches = new Touches();
		this.fixedPoint = new FixedPoint(this.touches);
		this.tool = new ToolState(this.touches, this.fixedPoint);

		this.unsub.push(this.tool.doTransform());
		this.unsub.push(this.fixedPoint.selectOrigin());
		this.unsub.push(this.fixedPoint.moveOrigin());
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
