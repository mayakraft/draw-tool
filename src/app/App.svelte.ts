import type { UI } from "../ui/ui.svelte.ts";
import { Model } from "../model/model.svelte.ts";
//import { Settings } from "./Settings.svelte.ts";
//import { LocalStorage } from "./localStorage.svelte.ts";

class Application {
  // todo: when a new viewport is added we need to trigger a re-draw on all
  // existing viewports (WebGL specifically), as the aspect ratio will change.
  ui: UI | undefined;
  model: Model;

  constructor() {
    //this.ui = new UI();
    this.model = new Model();

    this.model.shapes.push({ name: "circle", params: { cx: 0, cy: 0, r: 1 } });
    this.model.shapes.push({ name: "circle", params: { cx: 0, cy: 0, r: Math.SQRT2 } });
    this.model.shapes.push({ name: "rect", params: { x: 0, y: 0, width: 1, height: 1 } });
    this.model.shapes.push({ name: "line", params: { x1: 0, y1: 0, x2: 1, y2: 1 } });
    this.model.shapes.push({ name: "line", params: { x1: 1, y1: 0, x2: 0, y2: 1 } });
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc() {
    this.ui?.dealloc();
  }
}

// load a bunch of default settings and create a reactive effect
// which watches for changes and writes settings to local storage.
//new LocalStorage(app);

export default new Application();

