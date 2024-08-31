import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
	makeMatrix2Translate,
} from "rabbit-ear/math/matrix2.js";
import { getScreenPoint } from "../js/matrix.ts";
import { renderer } from "./renderer.svelte.ts";
import { tool } from "./tool.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../types.ts";

const wheelEventZoomMatrix = ({ point, deltaY }: { point: [number, number], deltaY: number }) => {
	const scaleOffset = deltaY / 333;
	const scale = 1 - scaleOffset;

	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(
		scale,
		getScreenPoint(point, renderer.view.model),
	);

	// safety check.
	// if the determininat is too small, return unchanged matrix
	// the reason is because the viewMatrix is built from the
	// inverse of this matrix, a bad det makes an invalid inverse.
	const newMatrix = multiplyMatrices2(renderer.view.camera, matrix);
	const det = determinant2(newMatrix);
	if (Math.abs(det) < 1e-11) {
		return [1e-5, 0, 0, 1e-5, renderer.view.camera[4], renderer.view.camera[5]];
	}
	if (Math.abs(det) > 1e11) {
		return [1e5, 0, 0, 1e5, 0, 0];
	}
	return newMatrix;
};

const wheelPanMatrix = ({ deltaX, deltaY }: { deltaX: number, deltaY: number }) => {
	const touchScale = -1 / 300;
	const impliedScale = renderer.view.modelView[0];
	const translate = [
		deltaX * touchScale * impliedScale,
		deltaY * touchScale * impliedScale,
	];
	const matrix = makeMatrix2Translate(translate[0], translate[1]);
	return multiplyMatrices2(renderer.view.camera, matrix);
};

export const windowWheelEvent = ({ point, deltaX, deltaY, id }: ScaledWheelEvent) => {
	switch (id) {
		case "left-canvas":
			renderer.view.camera = wheelEventZoomMatrix({ point, deltaY });
			break;
		case "right-canvas":
			renderer.view.camera = wheelPanMatrix({ deltaX, deltaY });
			break;
		default:
			renderer.view.camera = wheelEventZoomMatrix({ point, deltaY });
			break;
	}
};

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
		windowWheelEvent(event);
	}
};
