import { viewBox } from "./viewBox.svelte.ts";

/**
 * @description Stroke-width will use this value and multiply it against
 * the viewport to get the absolute stroke-width value.
 */
// const strokeWidthFactor = 1 / 300;
const strokeWidthFactor = 0.001;

/**
 * @description On Safari only, no matter the viewBox size,
 * if a stroke width is below 0.001 it disappears, even if the viewBox
 * is highly zoomed-in and 0.001 is a very thick line, it still disappears.
 * It feels like a bug. But, we have to work around it.
 */
const strokeWidthMin = 0.001;

export const strokeWidth = (() => {
	const value = $derived.by(() => {
		const width = Math.max(viewBox.array[2], viewBox.array[3]) * strokeWidthFactor;
		return Math.max(strokeWidthMin, width);
	});
	return {
		get value() { return value; },
	};
})();

/**
 * @description Stroke-dasharray is zoom-level dependent, styles everywhere
 * can reference this value to use inside the app. Because this gets
 * recalculated 120fps when the user zooms or pans, it's best to set
 * this property as low in the DOM heirarchy, nearest to the elements
 * as possible; as it turns out, browsers have a habbit of re-calculating
 * styles on every child element, causing a redraw, causing a huge slow down
 * if this is placed on a root element with many children.
 */
export const strokeDashLength = (() => {
	const value = $derived(strokeWidth.value * 8);
	return {
		get value() { return value; },
	};
})();
