import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";

export default <Tool>{
	key: "select",
	name: "select",
	icon,
	pointerEvent: () => { },
	reset: () => { },
	subscribe: () => { },
	unsubscribe: () => { },
	SVGLayer: undefined,
	panel: undefined,
};
