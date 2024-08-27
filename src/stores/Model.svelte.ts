// import { CameraMatrix } from "./ViewBox.svelte.js";
// import { Selection } from "./Select.js";
import ear from "rabbit-ear";

type Shape = {
	name: string;
	params: object;
};

const shapeToElement = ({ name, params }: Shape) => {
	switch (name) {
		case "rect": return ear.svg.rect(params.x, params.y, params.width, params.height);
		case "line": return ear.svg.line(params.x1, params.y1, params.x2, params.y2);
		case "circle": return ear.svg.circle(params.cx, params.cy, params.r);
		case "path": return ear.svg.path(params.d);
	}
};

export const model = (() => {
	let elements: Shape[] = $state([]);
	return {
		get elements() { return elements; },
		set elements(newElements) { elements = newElements; },
		push(...newElements: Shape[]) { elements.push(...newElements); },
		pop() { elements.pop(); },
		clear() { elements = []; },
		addLine(x1:number, y1:number, x2:number, y2:number) {
			elements.push({ name: "line", params: { x1, y1, x2, y2 } });
		},
		addCircle(cx:number, cy:number, r:number) {
			elements.push({ name: "circle", params: { cx, cy, r } });
		},
		addRect(x:number, y:number, width:number, height:number) {
			elements.push({ name: "rect", params: { x, y, width, height } });
		},
		addPath({ d }: { d: string }) {
			elements.push({ name: "path", params: { d } });
		},
	}
})();

export const modelElements = (() => {
	const elements = $derived(model.elements
		.map(shapeToElement)
		.filter(a => a !== undefined));
	return {
		get elements() { return elements; }
	}
})();

model.elements.push({ name: "line", params: { x1: 0, y1: 0, x2: 100, y2: 10 } });
model.elements.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
model.elements.push({ name: "circle", params: { cx: 0, cy: 0, r: 50 } });

// export const Reset = () => {
// 	RecalculateModelMatrix();
// 	Selection.reset();
// 	FrameIndex.set(0);
// 	FileMetadata.set(getFileMetadata(FOLD));
// 	Frames.set(frames);
// 	CameraMatrix.reset();
// };
