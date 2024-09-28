import type { UITool } from "./tool.ts";
import type { Viewport } from "./viewport/viewport.ts";
import { SVGViewport } from "./viewport/SVGViewport/SVGViewport.svelte.ts";
import { WebGLViewport } from "./viewport/WebGLViewport/WebGLViewport.svelte.ts";
//import { Snap } from "./snap/Snap.svelte.ts";

export class UI {
  viewports: Viewport[] = $state([]);
  //snap: Snap;
  #tool: UITool | undefined = $state();
  #effects: Function[] = [];

  get tool() {
    return this.#tool;
  }
  set tool(t: UITool | undefined) {
    this.#tool?.dealloc();
    this.#tool = t;
  }

  #makeToolViewportEffect = () => $effect.root(() => {
    $effect(() => {
      this.viewports.forEach((viewport) => viewport.dealloc());
      this.viewports.forEach((viewport) => this.tool?.bindTo(viewport));
    });
    return () => {
      this.viewports.forEach((viewport) => viewport.dealloc());
    };
  });

  constructor() {
    //this.snap = new Snap();
    this.viewports = [new SVGViewport(), new WebGLViewport()];
    this.#effects = [this.#makeToolViewportEffect()];
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc() {
    this.#effects.forEach((cleanup) => cleanup());
  }
};

