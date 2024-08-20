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
 * @description SVG canvas pointer event (mousedown, mousemove, mouseup)
 * gets bound to this, which runs any app-wide pointer methods, and checks
 * if there is a UI tool with a pointer event, call the tool's pointer event.
 */
export const PointerEvent = (eventType: string, event: ScaledMouseEvent) => {
	// Pointer.position = event.point;
	if (tool && tool.value && tool.value.pointerEvent) {
		tool.value.pointerEvent(eventType, event);
	}
};

/**
 * @description SVG canvas scrolling event gets bound to this.
 */
export const ScrollEvent = ({ point, deltaY, wheelDelta }: ScaledWheelEvent) => {
	// const scaleOffset = wheelDelta / 666;
	const scaleOffset = -deltaY / 333;
	const scale = 1 + scaleOffset;
	// the input point is in ModelViewMatrix space,
	// which includes ModelMatrix. But, in the upcoming line we are only
	// applying a change to the CameraMatrix. So, before we modify the
	// CameraMatrix with this point, we need to "remove" the ModelMatrix
	// out of this point (multiply by the inverse of ModelMatrix).
	const matrix = makeMatrix2UniformScale(
		scale,
		getScreenPoint(point, modelMatrix.value),
	);
	cameraMatrix.value = (() => {
		// safety check.
		// if the determininat is too small, return unchanged matrix
		// the reason is because the viewMatrix is built from the
		// inverse of this matrix, a bad det makes an invalid inverse.
		const newMatrix = multiplyMatrices2(cameraMatrix.value, matrix);
		const det = determinant2(newMatrix);
		const tooSmall = Math.abs(det) < 1e-11;
		const tooLarge = Math.abs(det) > 1e11;
		if (tooSmall) {
			return [1e-5, 0, 0, 1e-5, cameraMatrix.value[4], cameraMatrix.value[5]];
		}
		if (tooLarge) {
			return [1e5, 0, 0, 1e5, 0, 0];
		}
		return newMatrix;
	})();
};
