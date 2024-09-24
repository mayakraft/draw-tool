import type { UITool } from "./tool.ts";
import type { Viewport } from "./viewport/viewport.ts";
import { SVGViewport } from "./viewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "./viewport/WebGLViewport.svelte.ts";
import { Snap } from "./snap.svelte.ts";
//import { Preferences } from "./preferences.svelte.ts";
//import { LocalStorage } from "./localStorage.svelte.ts";

// potentially move a lot of this stuff into an AppUISettings
// then link to it from here with a member property .ui
export class AppSettings {
	// todo: when a new viewport is added we need to trigger a re-draw on all
	// existing viewports (WebGL specifically), as the aspect ratio will change.
	viewports: Viewport[] = $state([]);
	snap: Snap;
	#tool: UITool | undefined = $state();
	#effects: Function[] = [];

	get tool() {
		return this.#tool;
	}
	set tool(t: UITool | undefined) {
		this.#tool?.dealloc();
		this.#tool = t;
	}

	#makeToolViewportEffect = () =>
		$effect.root(() => {
			$effect(() => {
				this.viewports.forEach((viewport) => viewport.dealloc());
				this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
			});
			return () => {
				this.viewports.forEach((viewport) => viewport.dealloc());
			};
		});

	constructor() {
		this.snap = new Snap();
		this.viewports = [new SVGViewport(), new WebGLViewport()];
		this.#effects = [this.#makeToolViewportEffect()];
	}

	// this is not really planned, but if ever the app was to completely de-initialize and
	// re-initialize itself, we would call this method to cleanup the hanging effect.
	dealloc() {
    this.#effects.forEach((cleanup) => cleanup());
	}
}

export const app = new AppSettings();

// load a bunch of default settings and create a reactive effect
// which watches for changes and writes settings to local storage.
//new LocalStorage(app);

