import type { ToolNew } from "../../types.ts";
import type { Viewport } from "../../stores/viewport.svelte.ts";
import icon from "./icon.svelte";
import { GlobalState, ViewportState } from "./state.svelte.ts";

class Tool implements ToolNew {
	static key = "empty";
	static name = "empty";
	static icon = icon;

	state = new GlobalState();
	panel = undefined;

	viewportStates: ViewportState[] = [];

	bindTo(viewport: Viewport): Function {
		const viewportState = new ViewportState(viewport);
		this.viewportStates.push(viewportState);
		viewportState.subscribe();
		return viewportState.unsubscribe;
	}

	subscribe() {
		this.state.subscribe();
	}
	unsubscribe() {
		this.state.unsubscribe();
	}
	reset() {
		this.state.reset();
	}
}

export default Tool;
