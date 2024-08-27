import {
	touches,
	// move,
	// drag,
	// press,
	// release,
	reset,
} from "./state.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent} from "../../types.ts";

export const onmousemove = ({ point, buttons }: ScaledMouseEvent) => {
	touches.move = (buttons ? undefined : point);
	touches.drag = (buttons ? point : undefined);
};

export const onmousedown = ({ point, buttons }: ScaledMouseEvent) => {
	touches.move = (buttons ? undefined : point);
	touches.drag = (buttons ? point : undefined);
	touches.press = point;
};

export const onmouseup = ({ point, buttons }: ScaledMouseEvent) => {
	touches.move = (buttons ? undefined : point);
	touches.drag = (buttons ? point : undefined);
	touches.release = point;
};

export const onmouseleave = (event: ScaledMouseEvent) => {
	reset();
};
