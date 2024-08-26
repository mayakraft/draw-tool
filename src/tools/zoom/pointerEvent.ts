import {
	touches,
	// move,
	// drag,
	// press,
	// release,
	reset,
} from "./state.svelte.ts";

import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const pointerEvent = (eventType: string, { point, buttons }: ScaledMouseEvent) => {
	touches.move = (buttons ? undefined : point);
	touches.drag = (buttons ? point : undefined);
	switch (eventType) {
		case "press":
			touches.press = point;
			break;
		case "release":
			touches.release = point;
			break;
		case "exit":
			reset();
			break;
	}
};
