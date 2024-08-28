import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.press = point;
	state.touches.release = undefined;
};

export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.release = point;
};

export const onmouseleave = (event: ScaledMouseEvent) => {
	state.reset();
};

// export const pointerEvent = (eventType: string, { point, buttons }: ScaledMouseEvent) => {
// 	move.value = (buttons ? undefined : point);
// 	drag.value = (buttons ? point : undefined);
// 	switch (eventType) {
// 		case "press":
// 			presses.value.push(point);
// 			break;
// 		case "release":
// 			releases.value.push(point);
// 			break;
// 		case "exit":
// 			reset();
// 			break;
// 	}
// };
