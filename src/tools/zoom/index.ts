import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import state from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup, onmouseleave } from "./pointerEvent.ts";

export default <Tool>{
	key: "zoom",
	name: "zoom",
	icon,
	state,
	SVGLayer: undefined,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
	onmouseleave,
};
