import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import state from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup, onmouseleave } from "./pointerEvent.ts";

export default <Tool>{
	key: "segement",
	name: "segement",
	icon,
	state,
	SVGLayer,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
	onmouseleave,
};
