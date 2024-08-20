/**
 *
 */
export const verticalUp = (() => {
	let value = $state(localStorage.getItem("verticalUp") !== null
		? localStorage.getItem("verticalUp") === "true"
		: true);
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

/**
 * @description Show/Hide various things across the app.
 */
export const showGrid = (() => {
	let value = $state(localStorage.getItem("showGrid") !== null
		? localStorage.getItem("showGrid") === "true"
		: true);
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

/**
 *
 */
export const showAxes = (() => {
	let value = $state(localStorage.getItem("showAxes") !== null
		? localStorage.getItem("showAxes") === "true"
		: true);
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

/**
 *
 */
export const gridType = (() => {
	let value = $state(localStorage.getItem("gridType") || "square");
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
})();

// VerticalUp.subscribe((value) => localStorage.setItem("VerticalUp", String(value)));
// ShowGrid.subscribe((value) => localStorage.setItem("ShowGrid", String(value)));
// ShowAxes.subscribe((value) => localStorage.setItem("ShowAxes", String(value)));
// GridType.subscribe((value) => localStorage.setItem("GridType", value));
