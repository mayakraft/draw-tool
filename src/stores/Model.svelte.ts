// import { CameraMatrix } from "./ViewBox.svelte.js";
// import { Selection } from "./Select.js";
import ear from "rabbit-ear";
import type { FOLD } from "rabbit-ear/types.js";

export type Shape = {
	name: string;
	params: object;
};

export const shapeToElement = ({ name, params }: Shape) => {
	switch (name) {
		case "rect":
			return ear.svg.rect(params.x, params.y, params.width, params.height);
		case "line":
			return ear.svg.line(params.x1, params.y1, params.x2, params.y2);
		case "circle":
			return ear.svg.circle(params.cx, params.cy, params.r);
		case "path":
			return ear.svg.path(params.d);
	}
};

// temporarily returns all circles, that's all.
const getShapesInRect = (shapes: Shape[], rect): number[] => {
	return shapes
		.map(({ name }, i) => (name === "circle" ? i : undefined))
		.filter((a) => a !== undefined);
};

export const model = (() => {
	let elements: Shape[] = $state([]);
	let selected: number[] = $state([]);
	let fold: FOLD = $state({});

	return {
		get elements() {
			return elements;
		},
		set elements(newElements) {
			elements = newElements;
		},

		get selected() {
			return selected;
		},
		set selected(newSelected) {
			selected = newSelected;
		},

		get fold() {
			return fold;
		},
		selectedInsideRect(rect) {
			this.selected = getShapesInRect(this.elements, rect);
			// console.log(this.selected);
		},
		push(...newElements: Shape[]) {
			elements.push(...newElements);
		},
		pop() {
			elements.pop();
		},
		clear() {
			elements = [];
		},
		addLine(x1: number, y1: number, x2: number, y2: number) {
			elements.push({ name: "line", params: { x1, y1, x2, y2 } });
		},
		addCircle(cx: number, cy: number, r: number) {
			elements.push({ name: "circle", params: { cx, cy, r } });
		},
		addRect(x: number, y: number, width: number, height: number) {
			elements.push({ name: "rect", params: { x, y, width, height } });
		},
		addPath({ d }: { d: string }) {
			elements.push({ name: "path", params: { d } });
		},
	};
})();

export const modelElements = (() => {
	const elements = $derived(
		model.elements.map(shapeToElement).filter((a) => a !== undefined),
	);
	return {
		get elements() {
			return elements;
		},
	};
})();

// export const Reset = () => {
// 	RecalculateModelMatrix();
// 	Selection.reset();
// 	FrameIndex.set(0);
// 	FileMetadata.set(getFileMetadata(FOLD));
// 	Frames.set(frames);
// 	CameraMatrix.reset();
// };

model.elements.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
model.elements.push({ name: "circle", params: { cx: 0, cy: 0, r: Math.SQRT2 } });
model.elements.push({ name: "circle", params: { cx: 0, cy: 0, r: 2 } });
model.elements.push({ name: "line", params: { x1: 2, y1: 0, x2: 1, y2: 0 } });
model.elements.push({ name: "line", params: { x1: -1, y1: 0, x2: -2, y2: 0 } });
model.elements.push({ name: "rect", params: { x: 2, y: -3, width: 1, height: 1 } });
model.elements.push({ name: "rect", params: { x: -3, y: -3, width: 1, height: 1 } });
model.elements.push({ name: "rect", params: { x: -3, y: 2, width: 1, height: 1 } });
model.elements.push({ name: "rect", params: { x: 2, y: 2, width: 1, height: 1 } });
model.elements.push({ name: "line", params: { x1: -1, y1: -3, x2: -3, y2: -1 } });
model.elements.push({ name: "line", params: { x1: -3, y1: 1, x2: -1, y2: 3 } });
model.elements.push({ name: "line", params: { x1: 1, y1: 3, x2: 3, y2: 1 } });
model.elements.push({ name: "line", params: { x1: 3, y1: -1, x2: 1, y2: -3 } });
