import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.touches) { return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.touches) { return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.press = point;
	state.touches.release = undefined;
};

export const onmouseup = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.touches) { return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.release = point;
};

// export const onmouseleave = (event: ScaledMouseEvent) => {
// 	state.reset();
// };