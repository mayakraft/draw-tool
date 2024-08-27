import {
	state,
	reset,
} from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
	state.move = (buttons ? undefined : point);
	if (buttons) {
		state.drags.push(point);
	}
};

export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
	state.move = (buttons ? undefined : point);
	state.drags = [];
	state.presses.push(point);
};

export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
	state.move = (buttons ? undefined : point);
	// state.drags = (buttons ? point : undefined);
	state.releases.push(point);
	state.addToModel();
};

// export const onmouseleave = (event: ScaledMouseEvent) => {
// 	reset();
// };
