import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import state, { reset, unsubscribe, subscribe } from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup } from "./events.ts";

export default <Tool>{
	key: "rect",
	name: "rect",
	icon,
	// reset: () => state.reset(),
	// subscribe: () => state.subscribe(),
	// unsubscribe: () => state.unsubscribe(),
	reset,
	subscribe,
	unsubscribe,
	SVGLayer,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
};
