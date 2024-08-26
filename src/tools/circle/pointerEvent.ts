import {
	touches,
	reset,
} from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const pointerEvent = (eventType: string, { point, buttons }: ScaledMouseEvent) => {
	touches.move = (buttons ? undefined : point);
	touches.drag = (buttons ? point : undefined);
	switch (eventType) {
		case "press":
			touches.presses.push(point);
			break;
		case "release":
			touches.releases.push(point);
			break;
		case "exit":
			reset();
			break;
	}
};
