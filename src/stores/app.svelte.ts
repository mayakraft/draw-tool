import type { Tool, ToolNew, ToolViewport } from "../types.ts";
import { Viewport } from "./viewport.svelte.ts";

// const Effectify = (func: () => void) => ($effect.root(() => {
// 	$effect(func);
// 	return () => { };
// }));

// potentially move a lot of this stuff into an AppUISettings
// then link to it from here with a member property .ui
class AppSettings {
	// viewports: Viewport[] = $state([]);
	viewports: Viewport[] = $state([new Viewport(), new Viewport()]);

	// constructor() {
	// 	this.viewports = [new Viewport(), new Viewport()];
	// }

	// only reason we can't use a $derived here is because we need to "unsub"
	// from the previous instance. maybe there is a way around this.
	// toolViewport: ToolViewport[] = $derived(viewports
	// 	.map(viewport => {
	// 		if (!this.tool) { return undefined; }
	// 		return this.tool.bindToViewport(viewport);
	// 	}));


	// toolViewport: ToolViewport[] = $state([]);
	unsubFuncs: Function[] = [];

	#tool: ToolNew | undefined;
	get tool() { return this.#tool; };
	set tool(newTool: ToolNew | undefined) {
		// unsubscribe from previous tool
		if (this.#tool?.state?.unsubscribe) {
			this.#tool.state.unsubscribe();
		}
		// subscribe to new tool
		this.#tool = newTool;
		if (this.#tool?.state?.subscribe) {
			this.#tool.state.subscribe();
		}
		// setup a reactive variable, toolViewport, which is a kind of a
		// derived state, derived from both the tool and the app's viewports.
		$effect.root(() => {
			$effect(() => {
				this.unsubFuncs = this.viewports
					.map(viewport => this.tool?.bindTo(viewport))
					.filter(a => a !== undefined);
			});
			return () => {
				// unbind to viewport
			};
		});
	}
};

export const app = new AppSettings();

/**
 * @description This is the currently selected UI tool, as seen on the
 * toolbar (left side of screen). Tool definitions can be found inside
 * the tools/ folder.
 * @notes The tool setter will reset the UI between tools and
 * call any "subscribe" or "unsubscribe" methods, if they exist,
 * intended to cleanup or initialize Svelte stores which are specific
 * to each tool.
 */

/**
 * @description This will reset all visual feedback coming from the UI,
 * for example, this is called when switching between UI tools to reset
 * all visual feedback.
 */
export const resetUI = () => {
	// Pointer.set(undefined);
	// SnapPoint.set(undefined);
	// Highlight.reset();
	// GhostGraphCP.set({});
	// GuideLinesCP.set([]);
	// UILines.set([]);
	// UIRays.set([]);
	// UISegment.set([]);
	// RulersCP.set([]);
};
