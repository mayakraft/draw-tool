import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import { reset, subscribe, unsubscribe } from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup, onmouseleave } from "./pointerEvent.ts";

export default <Tool>{
	key: "segement",
	name: "segement",
	icon,
	reset,
	subscribe,
	unsubscribe,
	SVGLayer,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
	onmouseleave,
};
