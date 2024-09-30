import type { VecLine2 } from "rabbit-ear/types.js";
import { pointsToLine2 } from "rabbit-ear/math/convert.js";
import type { Deallocable } from "../../viewport/viewport.ts";
import type { SVGViewport } from "../../viewport/SVGViewport/SVGViewport.svelte.ts";
import app from "../../../app/App.svelte.ts";
import snap from "../../viewport/SVGViewport/Snap.svelte.ts";
import { SVGViewportEvents } from "./events.ts";
import { GlobalState } from "./GlobalState.svelte.ts";
import { SVGTouches } from "./SVGTouches.svelte.ts";
import SVGLayer from "./SVGLayer.svelte";

export class SVGViewportState implements Deallocable {
  viewport: SVGViewport;
  globalState: GlobalState;
  touches: SVGTouches;
  events: SVGViewportEvents;
  unsub: Function[] = [];

  constructor(viewport: SVGViewport, globalState: GlobalState) {
    this.viewport = viewport;
    this.globalState = globalState;

    this.touches = new SVGTouches(this.viewport);
    this.events = new SVGViewportEvents(this.viewport, this.touches);
    this.unsub.push(this.makeLine());
    this.unsub.push(this.preventBadInput());

    // bind data upwards
    this.viewport.layer = SVGLayer;
    const that = this;
    this.viewport.props = {
      get line() {
        return that.line;
      },
      get segment() {
        return that.segment;
      },
      get segmentPoints() {
        return that.segmentPoints;
      },
    };
  }

  dealloc() {
    console.log("line: viewport deinit");
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.touches.reset();
  }

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
          this.touches.reset();
        }
      });
      return () => { };
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
          app.model.addLine(x1, y1, x2, y2);
          this.touches.reset();
        }
      });
      return () => { };
    });
  }
}
