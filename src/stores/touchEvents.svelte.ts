import {
	makeMatrix2UniformScale,
	multiplyMatrices2,
	determinant2,
} from "rabbit-ear/math/matrix2.js";
import { getScreenPoint } from "../js/matrix.ts";
import {
	cameraMatrix,
	modelMatrix,
} from "./viewBox.svelte.ts";
import { tool } from "./tool.svelte.ts";
import { type ScaledMouseEvent, type ScaledWheelEvent } from "../types.ts";

/**
 * @description SVG canvas scrolling event gets bound to this.
 */
export const wheelWindowZoom = ({ point, deltaY }: ScaledWheelEvent) => {
	const scaleOffset = deltaY / 333;
	const scale = 1 - scaleOffset;

	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(
		scale,
		getScreenPoint(point, modelMatrix.value),
	);

	// safety check.
	// if the determininat is too small, return unchanged matrix
	// the reason is because the viewMatrix is built from the
	// inverse of this matrix, a bad det makes an invalid inverse.
	const newMatrix = multiplyMatrices2(cameraMatrix.value, matrix);
	const det = determinant2(newMatrix);
	const tooSmall = Math.abs(det) < 1e-11;
	const tooLarge = Math.abs(det) > 1e11;
	if (tooSmall) {
		cameraMatrix.value = [1e-5, 0, 0, 1e-5, cameraMatrix.value[4], cameraMatrix.value[5]];
	}
	else if (tooLarge) {
		cameraMatrix.value = [1e5, 0, 0, 1e5, 0, 0];
	}
	else {
		cameraMatrix.value = newMatrix;
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
		wheelWindowZoom(event);
	}
};
