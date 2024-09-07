import { tool } from "./tool.svelte.ts";
import zoomTool from "../tools/zoom/index.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../types.ts";

export const onmousemove = (event: ScaledMouseEvent) => (
	tool.value?.onmousemove?.(event));

export const onmousedown = (event: ScaledMouseEvent) => (
	tool.value?.onmousedown?.(event));

export const onmouseup = (event: ScaledMouseEvent) => (
	tool.value?.onmouseup?.(event));

export const onmouseleave = (event: ScaledMouseEvent) => (
	tool.value?.onmouseleave?.(event));

export const onwheel = (event: ScaledWheelEvent) => {
	if (tool.value && tool.value.onwheel) {
		tool.value.onwheel(event);
	}
	else {
		zoomTool.onwheel?.(event);
	}
};
