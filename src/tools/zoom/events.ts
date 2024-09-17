import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";
import {
	wheelEventZoomMatrix,
	wheelPanMatrix,
} from "./matrix.ts";

export const onmousemove = ({ point, buttons, id, viewport }: ScaledMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.viewport = viewport;
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons, id, viewport }: ScaledMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.viewport = viewport;
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.press = point;
};

export const onmouseup = ({ point, buttons, id, viewport }: ScaledMouseEvent) => {
	if (!state.tool) { return; }
	state.tool.viewport = viewport;
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.release = point;
};

// export const onmouseleave = (event: ScaledMouseEvent) => {
// 	state.reset();
// };

export const onwheel = ({ point, deltaX, deltaY, id, viewport }: ScaledWheelEvent) => {
	switch (id) {
		case "right-canvas": return wheelPanMatrix(viewport, { deltaX, deltaY });
		case "left-canvas": return wheelEventZoomMatrix(viewport, { point, deltaY });
		default: return wheelEventZoomMatrix(viewport, { point, deltaY });
	}
};
