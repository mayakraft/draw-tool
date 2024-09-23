//export type ViewportUIEvent = UIEvent & {
//  point: [number, number] | [number, number, number];
//}

export type ViewportMouseEvent = MouseEvent & {
	point: [number, number];
};

export type ViewportTouchEvent = TouchEvent & {
	point: [number, number];
};

export type ViewportWheelEvent = WheelEvent & {
	point: [number, number];
};

// export type GLViewportMouseEvent = (MouseEvent | TouchEvent) & {
// 	point?: [number, number];
// 	vector?: [number, number];
// 	deltaY?: number;
// };

export interface ViewportEvents {
	// touch events
	onmousemove?: (event: ViewportMouseEvent) => void;
	onmousedown?: (event: ViewportMouseEvent) => void;
	onmouseup?: (event: ViewportMouseEvent) => void;
	onmouseleave?: (event: ViewportMouseEvent) => void;
	onwheel?: (event: ViewportWheelEvent) => void;
	// touch screen events
	touchstart?: (event: ViewportTouchEvent) => void;
	touchend?: (event: ViewportTouchEvent) => void;
	touchmove?: (event: ViewportTouchEvent) => void;
	touchcancel?: (event: ViewportTouchEvent) => void;
	// keyboard events
	onkeydown?: (event: KeyboardEvent) => void;
	onkeyup?: (event: KeyboardEvent) => void;
}
