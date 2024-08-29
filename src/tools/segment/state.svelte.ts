import type { StateManagerType } from "../../types.ts";
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
				if (!this.presses.length || !this.releases.length) { return; }
				const points = [
					$state.snapshot(this.presses[0]),
					$state.snapshot(this.releases[0]),
				];
				// console.log("segment", ...points);
				model.addLine(points[0][0], points[0][1], points[1][0], points[1][1]);
				// executeCommand("segment", [$Press1Coords, $Release1Coords]);
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
		console.log("segment, subscribe");
		this.tool = new ToolState();
		this.unsub.push(this.tool.makeSegment());
	}

	unsubscribe() {
		console.log("segment, unsubscribe");
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
