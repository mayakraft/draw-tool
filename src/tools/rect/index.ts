import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import SVGLayer from "./SVGLayer.svelte";
import state from "./state.svelte.ts";
import { onmousemove, onmousedown, onmouseup } from "./events.ts";

export default <Tool>{
	key: "rect",
	name: "rect",
	icon,
	state,
	SVGLayer,
	panel: undefined,
	// pointer
	onmousemove,
	onmousedown,
	onmouseup,
};
