import {
	invertMatrix2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/matrix2.js";

/**
 *
 */
export const viewBoxOrigin = (box: [number, number, number, number], verticalUp = false): [number, number] =>
	!verticalUp ? [box[0], box[1]] : [box[0], -box[1] - box[3]];

/**
 * @description The input point is in ModelViewMatrix space,
 * which includes ModelMatrix. But, in the upcoming line we are only
 * applying a change to the CameraMatrix. So, before we modify the
 * CameraMatrix with this point, we need to "remove" the ModelMatrix
 * out of this point (multiply by the inverse of ModelMatrix).
 */
export const getScreenPoint = (point: [number, number], modelMatrix: number[]) => {
	if (point === undefined) {
		return undefined;
	}
	const inverseModelMatrix = invertMatrix2(modelMatrix);
	return inverseModelMatrix === undefined
		? point
		: multiplyMatrix2Vector2(inverseModelMatrix, point);
};
