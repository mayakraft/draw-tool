import { type Tool } from "../../types.ts";
import icon from "./icon.svelte";
import { pointerEvent } from "./pointerEvent.ts";
import SVGLayer from "./SVGLayer.svelte";
import { reset, subscribe, unsubscribe } from "./state.svelte.ts";

export default <Tool>{
	key: "select",
	name: "select",
	icon,
	pointerEvent,
	reset,
	subscribe,
	unsubscribe,
	SVGLayer,
	panel: undefined,
};
