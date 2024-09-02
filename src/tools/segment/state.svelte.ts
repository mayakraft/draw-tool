import type { StateManagerType } from "../../types.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";

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

	segment: [[number, number], [number, number]] | undefined = $derived.by(() => {
		if (this.snapPresses.length && this.snapReleases.length) {
			return [this.snapPresses[0], this.snapReleases[0]];
		}
		if (this.snapPresses.length && this.snapDrag) {
			return [this.snapPresses[0], this.snapDrag];
		}
		return undefined;
	});

	svgSegment: { x1: number, y1: number, x2: number, y2: number, } | undefined = $derived(
		!this.segment
			? undefined
			: {
				x1: this.segment[0][0],
				y1: this.segment[0][1],
				x2: this.segment[1][0],
				y2: this.segment[1][1],
			});

	reset() {
		this.move = undefined;
		this.drag = undefined;
		// this.presses = [];
		// this.releases = [];
		while (this.presses.length) { this.presses.pop(); }
		while (this.releases.length) { this.releases.pop(); }
	}

	makeSegment() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.snapPresses.length || !this.snapReleases.length || !this.segment) {
					return;
				}
				const [[x1, y1], [x2, y2]] = this.segment;
				model.addLine(x1, y1, x2, y2);
				this.reset();
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
		this.unsub.push(this.tool.makeSegment());
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
