import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import { reset, subscribe, unsubscribe } from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup, onmouseleave } from "./pointerEvent.ts";

export default <Tool>{
	key: "zoom",
	name: "zoom",
	icon,
	reset,
	subscribe,
	unsubscribe,
	SVGLayer: undefined,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
	onmouseleave,
};
