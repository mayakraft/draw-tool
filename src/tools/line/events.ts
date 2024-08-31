import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.presses.push(point);
};

export const onmouseup = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.releases.push(point);
};

// export const onmouseleave = (event: ScaledMouseEvent) => {
// 	reset();
// };
