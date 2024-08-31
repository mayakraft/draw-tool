import type { VecLine2 } from "rabbit-ear/types.js";
import {
	include,
	includeL,
	includeR,
	includeS,
	excludeS,
} from "rabbit-ear/math/compare.js";
import { clipLineConvexPolygon } from "rabbit-ear/math/clip.js";
import { renderer } from "../stores/renderer.svelte.ts";

export const clipLineInViewBox = (line: VecLine2 | undefined) => {
	if (!line) { return undefined; }
	return clipLineConvexPolygon(renderer.view.viewBoxPolygon, line, include, includeL);
};
