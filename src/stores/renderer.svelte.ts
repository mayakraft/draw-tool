import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
	makeMatrix2Translate,
	makeMatrix2UniformScale,
} from "rabbit-ear/math/matrix2.js";

class RenderView {
	verticalUp = $state(localStorage.getItem("VerticalUp") !== null
		? localStorage.getItem("VerticalUp") === "true"
		: false);

	camera = $state([...identity2x3]);

	#model = $state([...identity2x3]);
	get model() { return this.#model; }
	set model(matrix) {
		const old = this.#model;
		const scale = matrix[0] / old[0];
		const x = (matrix[4] - old[4]) / old[0];
		const y = (matrix[5] - old[5]) / old[0];
		const difference = [scale, 0, 0, scale, x, y];
		const newCamera = multiplyMatrices2(this.camera, difference);
		this.camera = newCamera;
		this.#model = matrix;
	};

	view = $derived.by(() => {
		const inverted = invertMatrix2(this.camera);
		return inverted ? inverted : [...identity2x3];
	});

	modelView = $derived(multiplyMatrices2(this.model, this.view));

	viewBox: [number, number, number, number] = $derived.by(() => {
		const m = [...this.modelView];
		// get the translation component
		const [, , , , x, y] = m;
		// remove the translation component
		m[4] = m[5] = 0;
		// multiply by unit basis vectors
		const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
		return [x, y, w, h];
	});

	viewBoxString = $derived(this.viewBox.join(" "));

	viewBoxPolygon: [number, number][] = $derived([
		[this.viewBox[0] - this.viewBox[2] * 10, this.viewBox[1] - this.viewBox[3] * 10],
		[this.viewBox[0] + this.viewBox[2] * 11, this.viewBox[1] - this.viewBox[3] * 10],
		[this.viewBox[0] + this.viewBox[2] * 11, this.viewBox[1] + this.viewBox[3] * 11],
		[this.viewBox[0] - this.viewBox[2] * 10, this.viewBox[1] + this.viewBox[3] * 11],
	]);

	resetCamera() {
		this.camera = [...identity2x3];
	}

	resetModel() {
		this.model = [...identity2x3];
	}

	reset() {
		this.resetCamera();
		this.resetModel();
	}
}

class RenderSettings {
	view = new RenderView();

	strokeWidthFactor = $state(0.001);
	strokeWidthMin = $state(0.001);
	vertexRadiusFactor = $state(0.00666);

	circleRadius = $derived(
		Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.vertexRadiusFactor,
	);

	strokeWidth = $derived(Math.max(
		this.strokeWidthMin,
		Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.strokeWidthFactor,
	));

	strokeDashLength = $derived(this.strokeWidth * 8);
};

export const renderer = (new RenderSettings());
