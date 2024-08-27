import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.presses.push(point);
};

export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
	if (!state.touches) { console.log("BAD events"); return; }
	state.touches.move = (buttons ? undefined : point);
	state.touches.drag = (buttons ? point : undefined);
	state.touches.releases.push(point);
};

// import state from "./state.svelte.ts";
// import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

// export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// };

// export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// 	state?.touches.presses.push(point);
// };

// export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
// 	state?.touches.move = (buttons ? undefined : point);
// 	state?.touches.drag = (buttons ? point : undefined);
// 	state?.touches.releases.push(point);
// };
