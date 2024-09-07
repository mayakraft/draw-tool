import state from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";
import { snapPoint } from "../../math/snap.svelte.ts";

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
	state.tool.snapPresses.push(snapPoint(point).coords);
};

export const onmouseup = ({ point, buttons, id }: ScaledMouseEvent) => {
	if (!state.tool) { console.log("BAD events"); return; }
	state.tool.move = (buttons ? undefined : point);
	state.tool.drag = (buttons ? point : undefined);
	state.tool.releases.push(point);
	state.tool.snapReleases.push(snapPoint(point).coords);
};

// export const onmouseleave = (event: ScaledMouseEvent) => {
// 	reset();
// };
