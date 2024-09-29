import type { UITool } from "./tool.ts";
import type { Viewport } from "./viewport/viewport.ts";
//import { Snap } from "./snap/Snap.svelte.ts";
import Tools from "./tools/index.ts";

// consider somehow binding the Settings object from inside of SVGViewport (and webgl)
// and making it accessible through this ui instance (for example: app.ui.SVGViewport.settings)
export class UI {
  viewports: Viewport[] = $state([]);
  //snap: Snap;
  #tool: UITool | undefined = $state();
  #effects: Function[] = [];

  get tool() {
    return this.#tool;
  }
  // no need to set the tool directly. use a string ("line", "zoom"), the tool's name.
  // if no tool matches the string, the tool will become unset (undefined).
  setToolName(name: string) {
    this.#tool?.dealloc();
    const NewTool: typeof UITool | undefined = Tools[name];
    // @ts-ignore - UITool is abstract, but none of these are UITools, ignore warning.
    this.#tool = NewTool === undefined ? undefined : new NewTool();
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
    this.#effects = [this.#makeToolViewportEffect()];
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc() {
    this.#effects.forEach((cleanup) => cleanup());
  }
};

