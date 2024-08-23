import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import { pointerEvent } from "./pointerEvent.ts";
import { reset, subscribe, unsubscribe } from "./state.svelte.ts";

export default <Tool>{
	key: "zoom",
	name: "zoom",
	icon,
	pointerEvent,
	reset,
	subscribe,
	unsubscribe,
	SVGLayer: undefined,
	panel: undefined,
};
