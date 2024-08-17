import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";

export default <Tool>{
	key: "scribble",
	name: "scribble",
	icon,
	pointerEvent: () => { },
	reset: () => { },
	subscribe: () => { },
	unsubscribe: () => { },
	SVGLayer: undefined,
	panel: undefined,
};
