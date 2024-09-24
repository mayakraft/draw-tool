import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { Destroyable } from "../../state/viewport/viewport.ts";
import type { SVGViewport } from "../../state/viewport/SVGViewport.svelte.ts";
import type { WebGLViewport } from "../../state/viewport/WebGLViewport.svelte.ts";
import { model } from "../../state/model.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import SVGLayer from "./SVGLayer.svelte";
import snap from "../../state/snap.svelte.ts";

export class Touches {
	viewport: SVGViewport;

	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();
	snapMove: [number, number] | undefined = $derived.by(() =>
		this.move ? snap.snapToPoint(this.move, this.viewport.snapRadius).coords : undefined,
	);
	snapDrag: [number, number] | undefined = $derived.by(() =>
		this.drag ? snap.snapToPoint(this.drag, this.viewport.snapRadius).coords : undefined,
	);
	//snapMove = $derived(this.viewport.snapPoint(this.move).coords);
	//snapDrag = $derived(this.viewport.snapPoint(this.drag).coords);

	presses: [number, number][] = $state([]);
	releases: [number, number][] = $state([]);
	snapPresses: [number, number][] = $state([]);
	snapReleases: [number, number][] = $state([]);

	constructor(viewport: SVGViewport) {
		this.viewport = viewport;
	}

	addPress(point: [number, number]) {
		const snapPoint = snap.snapToPoint(point, this.viewport.snapRadius).coords;
		this.presses.push(point);
		// if point is not undefined, result is not undefined
		this.snapPresses.push(snapPoint as [number, number]);
	}

	addRelease(point: [number, number]) {
		const snapPoint = snap.snapToPoint(point, this.viewport.snapRadius).coords;
		this.releases.push(point);
		// if point is not undefined, result is not undefined
		this.snapReleases.push(snapPoint as [number, number]);
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
	viewport: SVGViewport;
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
				? snap.snapToLine(this.touches.presses[1], this.viewport.snapRadius, snapLines)
						.coords
				: snap.snapToLine(this.touches.move, this.viewport.snapRadius, snapLines).coords;
		const point2 =
			this.touches.snapReleases.length >= 2
				? snap.snapToLine(this.touches.releases[1], this.viewport.snapRadius, snapLines)
						.coords
				: snap.snapToLine(this.touches.drag, this.viewport.snapRadius, snapLines).coords;
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
				const twoDifference =
					Math.abs(this.touches.releases.length - this.touches.presses.length) > 1;
				if (moreReleases || twoDifference) {
					console.log(
						"line: fixing touches",
						this.touches.presses.length,
						this.touches.releases.length,
					);
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

	constructor(viewport: SVGViewport, touches: Touches) {
		this.touches = touches;
		this.viewport = viewport;
	}
}

export class SVGViewportState implements Destroyable {
	viewport: SVGViewport;
	globalState: GlobalState;
	touches: Touches;
	tool: ToolState;
	events: SVGViewportEvents;
	unsub: Function[] = [];

	constructor(viewport: SVGViewport, globalState: GlobalState) {
		this.viewport = viewport;
		this.globalState = globalState;

		this.touches = new Touches(this.viewport);
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

	dealloc() {
		console.log("line: viewport deinit");
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.touches.reset();
	}
}

export class GLViewportState implements Destroyable {
	viewport: WebGLViewport;
	constructor(viewport: WebGLViewport) {
		this.viewport = viewport;
	}
	dealloc() {}
}

export class GlobalState implements Destroyable {
	constructor() {}
	dealloc() {}
}
