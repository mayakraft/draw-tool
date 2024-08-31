import { renderer } from "./renderer.svelte.ts";

/**
 * @description a UI touch event, coming from a pointer device, will have some
 * built-in error correcting (like snapping, for example), and this behavior
 * is zoom-level dependent. This is the factor out of 1 which is
 * scaled to the viewbox to get this ui-epsilon floating point error factor.
 */
const UIEpsilonFactor = 0.01;

/**
 * @description a UI touch event, coming from a pointer device, will have some
 * built-in error correcting (like snapping, for example), and this behavior
 * is zoom-level dependent. Use this variable to get an appropriate error-
 * correcting value.
 */
export const UIEpsilon = (() => {
	const value = $derived(Math.max(renderer.view.viewBox[2], renderer.view.viewBox[3]) * UIEpsilonFactor);
	return {
		get value() { return value; },
	};
})();
