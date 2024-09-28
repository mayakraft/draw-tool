import state from "./state.svelte.ts";
import type { ViewportMouseEvent, ViewportWheelEvent } from "../../types.ts";

export const onmousemove = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.addPress(point);
};

export const onmouseup = ({ point, buttons }: ViewportMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.addRelease(point);
};

// export const onmouseleave = (event: ViewportMouseEvent) => {
// 	reset();
// };