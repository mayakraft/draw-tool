import {
	move,
	presses,
	releases,
	drag,
	reset,
} from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const pointerEvent = (eventType: string, { point, buttons }: ScaledMouseEvent) => {
	move.value = (buttons ? undefined : point);
	drag.value = (buttons ? point : undefined);
	switch (eventType) {
		case "press":
			presses.value.push(point);
			break;
		case "release":
			releases.value.push(point);
			break;
		case "exit":
			reset();
			break;
	}
};
