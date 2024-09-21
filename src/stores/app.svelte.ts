import type { UITool } from "../types.ts";
import { Viewport } from "./viewport.svelte.ts";

const resetSVGViewport = (viewport: Viewport) => {
	viewport.layer = undefined;
	viewport.props = undefined;
	viewport.onmousemove = undefined;
	viewport.onmousedown = undefined;
	viewport.onmouseup = undefined;
	viewport.onmouseleave = undefined;
	viewport.onwheel = undefined;
};

let counter = 0;

// potentially move a lot of this stuff into an AppUISettings
// then link to it from here with a member property .ui
class AppSettings {
	// viewports: Viewport[] = $state([]);
	viewports: Viewport[] = $state([new Viewport(), new Viewport()]);

	#tool: UITool | undefined = $state();

	get tool() {
		return this.#tool;
	}

	set tool(t: UITool | undefined) {
		console.log("new tool:", t.constructor.name);
		this.#tool?.deinitialize();
		this.#tool = t;
	}

  toolViewportEffect: Function | undefined;

	constructor() {
		this.toolViewportEffect = $effect.root(() => {
			$effect(() => {
				this.viewports.forEach(resetSVGViewport);
				this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
			});
			return () => {
				console.log(counter++, "calling the cleanup");
			};
		});
	}

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  deinit() {
    if (this.toolViewportEffect) { this.toolViewportEffect(); }
  }
}

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
