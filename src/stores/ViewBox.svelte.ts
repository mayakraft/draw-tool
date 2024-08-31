import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
	makeMatrix2Translate,
	makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";

/**
 * @description vertex radius is is dynamic according to the zoom level
 * this number is a scale of the size of the viewbox.
 */
const VertexRadiusFactor = $state(0.00666);

export const verticalUp = (() => {
	let value = $state(
		localStorage.getItem("VerticalUp") !== null
			? localStorage.getItem("VerticalUp") === "true"
			: false);
	return {
		get value() { return value; },
		set value(newValue) { value = newValue; },
	};
})();

// console.log("verticalUp", verticalUp.value);

// const VerticalUpOnBoot = localStorage.getItem("VerticalUp") !== null
// 	? localStorage.getItem("VerticalUp") === "true"
// 	: true;
// const Identity2x3 = VerticalUpOnBoot
// 	? [1, 0, 0, 1, 0, -1]
// 	: [1, 0, 0, 1, 0, 0];

// const Identity2x3 = identity2x3; // [1, 0, 0, 1, 0, -1];

/**
 * @description The camera matrix is what the user modifies when they
 * pan around and scroll to zoom on the SVG canvas.
 */
export const cameraMatrix = (() => {
	let value = $state([...identity2x3]);
	return {
		get value() { return value; },
		set value(newValue) { value = newValue; },
		reset: () => { value = [...identity2x3]; },
	}
})();

// This approach does not work under the current arrangement,
// the ModelViewMatrix will update every single time the graph changes,
// in most cases this doesn't matter, except when the graph changes size.
// When a line is added outside the current bounds the effect is that
// the canvas jumps into a new position and is disorienting.
// Otherwise, this would be ideal, so, in case a more elegant work-around
// is found, I'm leaving this here for now.
// export const ModelMatrix = derived(
// 	CreasePattern,
// 	($CreasePattern) => graphToMatrix2($CreasePattern),
// 	[...identity2x3],
// );
/**
 * @description The model matrix is intended to describe a bounding box
 * around the graph model. This model matrix will always maintain
 * a 1:1 aspect ratio. Used to create the SVG's ViewBox.
 */
export const modelMatrix = (() => {
	let value = $state([...identity2x3]);
	return {
		get value() { return value; },
		set value(matrix) {
			// We are about to set the model matrix, and the new model matrix
			// will be fed into the ModelViewMatrix which affects the viewport,
			// however, we want the view to not move, but we can't abort the
			// changes to the model matrix, instead, we have to compute the
			// difference between the two model matrices before and after update,
			// and apply the inverse of the difference to the viewport.
			// Unfortunately we don't set the viewport, we don't set the view
			// matrix either, we set the camera matrix, but the camera is the
			// inverse of the view matrix, simple enough.
			// ModelView = Model * View = Model * inv(Camera)
			// newModel = oldModel * Difference
			// oldModelView = oldModel * View
			// newModelView = (oldModel * Difference) * View
			// we want: newModelView = oldModelView
			// we can't modify model matrix, but we can modify the view matrix
			// oldModelView = oldModel * View
			// newModelView = (oldModel * Difference) * View
			// newModelView = (oldModel * Difference) * (View * inv(Difference))
			// which factors into
			// newModelView = oldModel * View * Difference * inv(Difference)
			// newModelView = oldModel * View
			// which is what we want. (god i think rearranging matrices is wrong)
			// but anyway, View needs to become View * inv(Difference)
			// View is inv(Camera), so: inv(Camera) * inv(Difference)
			// can that simplify into: Camera * Difference?
			// then take the inverse to get the view again?
			const old = value;
			const scale = matrix[0] / old[0];
			const x = (matrix[4] - old[4]) / old[0];
			const y = (matrix[5] - old[5]) / old[0];
			const difference = [scale, 0, 0, scale, x, y];
			const newCameraMatrix = multiplyMatrices2(cameraMatrix.value, difference);
			cameraMatrix.value = newCameraMatrix;
			value = matrix;
		},
		reset: () => { value = [...identity2x3]; },
	}
})();

/**
 * @description The inverse of the camera matrix,
 * used to build the SVG's ViewBox.
 */
const viewMatrix = $derived.by(() => {
	const inverted = invertMatrix2(cameraMatrix.value);
	return inverted ? inverted : [...identity2x3];
});

/**
 * @description In a typical fashion, the model and view matrices are
 * multiplied together to make this model-view matrix.
 */
export const modelViewMatrix = (() => {
	const value = $derived(multiplyMatrices2(modelMatrix.value, viewMatrix));
	return {
		get value() { return value; },
	};
})();

/**
 * @description The SVG will set its "viewBox" property with this value,
 * a value which is based on the camera, as well as the model size.
 */
export const viewBox = (() => {
	const array: [number, number, number, number] = $derived.by(() => {
		const m = [...modelViewMatrix.value];
		// get the translation component
		const [, , , , x, y] = m;
		// remove the translation component
		m[4] = m[5] = 0;
		// multiply by unit basis vectors
		const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
		return [x, y, w, h];
	});

	const string = $derived(array.join(" "));

	const polygon: [number, number][] = $derived.by(() => {
		const [x, y, w, h] = array;
		return [
			[x - w * 10, y - h * 10],
			[x + w * 11, y - h * 10],
			[x + w * 11, y + h * 11],
			[x - w * 10, y + h * 11],
		];
	});

	// SVG circle elements use this for their radius value.
	const circleRadius = $derived(
		Math.max(array[2], array[3]) * VertexRadiusFactor,
	);

	return {
		get array() { return array; },
		get string() { return string; },
		get polygon() { return polygon; },
		get circleRadius() { return circleRadius; }
	};
})();
