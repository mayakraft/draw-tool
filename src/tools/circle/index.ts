import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";

export default <Tool>{
	key: "circle",
	name: "circle",
	icon,
	pointerEvent: () => { },
	// keyboardEvent: () => { },
	reset: () => { },
	subscribe: () => { },
	unsubscribe: () => { },
	SVGLayer: undefined,
	panel: undefined,
};
