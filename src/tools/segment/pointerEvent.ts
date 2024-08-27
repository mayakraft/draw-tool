import {
	move,
	presses,
	releases,
	drag,
	reset,
} from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
	move.value = (buttons ? undefined : point);
	drag.value = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
	move.value = (buttons ? undefined : point);
	drag.value = (buttons ? point : undefined);
	presses.value.push(point);
};

export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
	move.value = (buttons ? undefined : point);
	drag.value = (buttons ? point : undefined);
	releases.value.push(point);
};

export const onmouseleave = (event: ScaledMouseEvent) => {
	reset();
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
