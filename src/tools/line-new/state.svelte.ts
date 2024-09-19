import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { StateManagerType, SubUnsubReset } from "../../types.ts";
import { snapToLine } from "../../js/snap.ts";
import { snapPoint } from "../../math/snap.svelte.ts";
import { model } from "../../stores/model.svelte.ts";
import { Viewport } from "../../stores/viewport.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../../types.ts";
import { wheelEventZoomMatrix } from "../zoom-new/matrix.ts";
import SVGLayer from "./SVGLayer.svelte";

export class SVGViewportEvents {
	touches: Touches;
	viewport: Viewport;

	onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.touches) {
			return;
		}
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
	};

	onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.touches) {
			return;
		}
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
		this.touches.addPress(point);
	};

	onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
		if (!this.touches) {
			return;
		}
		this.touches.move = buttons ? undefined : point;
		this.touches.drag = buttons ? point : undefined;
		this.touches.addRelease(point);
	};

	//onmouseleave = (event: ScaledMouseEvent) => {
	//	this.state.reset();
	//};

	// new plan for onwheel
	// all tools must implement the "zoomTool.onwheel?.(event);" behavior.
	// there is no longer an app-wide fallthrough that executes that method
	// if no tool wheel event exists. the tool must specify the behavior explicitly.

	onwheel = ({ point, deltaX, deltaY }: ScaledWheelEvent) => {
		wheelEventZoomMatrix(this.viewport, { point, deltaY });
	};

	constructor(viewport: Viewport, touches: Touches) {
		this.viewport = viewport;
		this.touches = touches;

		this.viewport.onmousemove = this.onmousemove;
		this.viewport.onmousedown = this.onmousedown;
		this.viewport.onmouseup = this.onmouseup;
		//this.viewport.onmouseleave = this.onmouseleave;
		this.viewport.onwheel = this.onwheel;
	}

	unsubscribe() {
		this.viewport.onmousemove = undefined;
		this.viewport.onmousedown = undefined;
		this.viewport.onmouseup = undefined;
		this.viewport.onmouseleave = undefined;
		this.viewport.onwheel = undefined;
	}
}

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

	reset() {
		this.touches.reset();
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
					this.reset();
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

export class ViewportState implements SubUnsubReset {
	viewport: Viewport;
	globalState: GlobalState;
	touches: Touches | undefined;
	tool: ToolState | undefined;
	events: SVGViewportEvents | undefined;
	unsub: Function[] = [];

	constructor(viewport: Viewport, globalState: GlobalState) {
		this.viewport = viewport;
		this.globalState = globalState;
	}

	// consider moving this into the constructor and removing the concept of
	// "subscribe" altogether.
	subscribe() {
		this.unsubscribe();
		this.touches = new Touches();
		this.tool = new ToolState(this.viewport, this.touches);
		this.events = new SVGViewportEvents(this.viewport, this.touches);
		this.unsub.push(this.tool.makeLine());
		this.unsub.push(this.events.unsubscribe);

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

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.reset();
		this.tool = undefined;
	}

	reset() {
		this.tool?.reset();
	}
}

export class GlobalState implements SubUnsubReset {
	constructor() {}
	subscribe() {}
	unsubscribe() {}
	reset() {}
}
