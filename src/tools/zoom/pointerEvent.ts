import {
	move,
	drag,
	press,
	release,
	reset,
} from "./state.svelte.ts";

import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const pointerEvent = (eventType: string, { point, buttons }: ScaledMouseEvent) => {
	move.value = (buttons ? undefined : point);
	drag.value = (buttons ? point : undefined);
	switch (eventType) {
		case "press":
			press.value = point;
			break;
		case "release":
			release.value = point;
			break;
		case "exit":
			reset();
			break;
	}
};
