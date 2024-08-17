export const createSignal = <T>(initial: T) => {
	let value = $state(initial);
	return {
		get value() { return value; },
		set value(v) { value = v; },
	};
};
