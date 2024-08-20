import {
	include,
	includeL,
	includeR,
	includeS,
	excludeS,
} from "rabbit-ear/math/compare.js";
import { clipLineConvexPolygon } from "rabbit-ear/math/clip.js";

// const clipLineInViewport = (line, box, lineFn = includeL) => {
// 	const polygon = [
// 		[box[0], box[1]],
// 		[box[0] + box[2], box[1]],
// 		[box[0] + box[2], box[1] + box[3]],
// 		[box[0], box[1] + box[3]],
// 	];
// 	return clipLineConvexPolygon(polygon, line, include, lineFn);
// };

export const clipLineFuncInLargerViewport = (line, lineFn = includeL, box) => {
	const [x, y, w, h] = box;
	const polygon = [
		[x - w * 10, y - h * 10],
		[x + w * 11, y - h * 10],
		[x + w * 11, y + h * 11],
		[x - w * 10, y + h * 11],
	];
	return clipLineConvexPolygon(polygon, line, include, lineFn);
};

export const clipLineInLargerViewport = (line, box) =>
	clipLineFuncInLargerViewport(line, includeL, box);

export const clipRayInLargerViewport = (line, box) =>
	clipLineFuncInLargerViewport(line, includeR, box);
