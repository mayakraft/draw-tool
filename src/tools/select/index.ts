import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import state from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup, onmouseleave } from "./pointerEvent.ts";

export default <Tool>{
	key: "select",
	name: "select",
	icon,
	reset: () => state.reset(),
	subscribe: () => state.subscribe(),
	unsubscribe: () => state.unsubscribe(),
	SVGLayer,
	panel: undefined,
	onmousemove,
	onmousedown,
	onmouseup,
	onmouseleave,
};
