import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { Destroyable } from "../../types.ts";
import { snapToLine } from "../../js/snap.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";
import { Viewport } from "../../stores/viewport.svelte.ts";
import { wheelEventZoomMatrix } from "../zoom-new/matrix.ts";
import { SVGViewportEvents } from "./events.ts";
import SVGLayer from "./SVGLayer.svelte";

export class Touches {
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	snapMove = $derived(snapPoint(this.move).coords);
	snapDrag = $derived(snapPoint(this.drag).coords);

	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	snapPresses: [number, number][] = $state([]);
	snapReleases: [number, number][] = $state([]);

	addPress(point: [number, number]) {
		this.presses.push(point);
		this.snapPresses.push(snapPoint(point).coords);
	}

	addRelease(point: [number, number]) {
		this.releases.push(point);
		this.snapReleases.push(snapPoint(point).coords);
	}

	reset() {
		this.move = undefined;
		this.drag = undefined;
		while (this.presses.length) {
			this.presses.pop();
		}
		while (this.releases.length) {
			this.releases.pop();
		}
		while (this.snapPresses.length) {
			this.snapPresses.pop();
		}
		while (this.snapReleases.length) {
			this.snapReleases.pop();
		}
	}
}

export class ToolState {
	viewport: Viewport;
	touches: Touches;

	line: VecLine2 | undefined = $derived.by(() => {
		if (this.touches.snapPresses.length && this.touches.snapReleases.length) {
			return pointsToLine2(this.touches.snapPresses[0], this.touches.snapReleases[0]);
		}
		if (this.touches.snapPresses.length && this.touches.snapDrag) {
			return pointsToLine2(this.touches.snapPresses[0], this.touches.snapDrag);
		}
		return undefined;
	});

	segmentPoints: [number, number][] | undefined = $derived.by(() => {
		if (!this.line) {
			return undefined;
		}
		if (!this.touches.snapPresses.length || !this.touches.snapReleases.length) {
			return undefined;
		}
		const snapLines = [{ line: this.line, clamp: (a: any) => a, domain: () => true }];
		const point1 =
			this.touches.snapPresses.length >= 2
				? snapToLine(this.touches.snapPresses[1], snapLines).coords
				: snapToLine(this.touches.snapMove, snapLines).coords;
		const point2 =
			this.touches.snapReleases.length >= 2
				? snapToLine(this.touches.snapReleases[1], snapLines).coords
				: snapToLine(this.touches.snapDrag, snapLines).coords;
		const result = [];
		if (point1) {
			result.push(point1);
		}
		if (point2) {
			result.push(point2);
		}
		return result;
	});

	segment: [number, number][] | undefined = $derived(
		this.segmentPoints && this.segmentPoints.length < 2 ? undefined : this.segmentPoints,
	);

  preventBadInput() {
    return $effect.root(() => {
      $effect(() => {
        const moreReleases = this.touches.releases.length > this.touches.presses.length;
        const twoDifference = Math.abs(this.touches.releases.length - this.touches.presses.length) > 1;
        if (moreReleases || twoDifference) {
          console.log("line: fixing touches", this.touches.presses.length, this.touches.releases.length);
          this.touches.reset();
        }
      });
      return () => {};
    });
  }

	makeLine() {
		return $effect.root(() => {
			$effect(() => {
				if (
					this.touches.snapPresses.length >= 2 &&
					this.touches.snapReleases.length >= 2 &&
					this.segment
				) {
					const [[x1, y1], [x2, y2]] = this.segment;
					model.addLine(x1, y1, x2, y2);
					this.touches.reset();
				}
			});
			return () => {};
		});
	}

	constructor(viewport: Viewport, touches: Touches) {
		this.touches = touches;
		this.viewport = viewport;
	}
}

export class ViewportState implements Destroyable {
	viewport: Viewport;
	globalState: GlobalState;
	touches: Touches;
	tool: ToolState;
	events: SVGViewportEvents;
	unsub: Function[] = [];

	constructor(viewport: Viewport, globalState: GlobalState) {
		this.viewport = viewport;
		this.globalState = globalState;

		this.touches = new Touches();
		this.tool = new ToolState(this.viewport, this.touches);
		this.events = new SVGViewportEvents(this.viewport, this.touches);
		this.unsub.push(this.tool.makeLine());
		this.unsub.push(this.tool.preventBadInput());

		// bind data upwards
		this.viewport.layer = SVGLayer;
		const tool = this.tool;
		this.viewport.props = {
			get line() {
				return tool.line;
			},
			get segment() {
				return tool.segment;
			},
			get segmentPoints() {
				return tool.segmentPoints;
			},
		};
	}

	deinitialize() {
    console.log("line: viewport deinit");
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.touches.reset();
		this.tool = undefined;
	}
}

export class GlobalState implements Destroyable {
	constructor() {}
	deinitialize() {}
}

