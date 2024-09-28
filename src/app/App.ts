import { UI } from "../ui/ui.svelte.ts";
//import { Preferences } from "./preferences.svelte.ts";
//import { LocalStorage } from "./localStorage.svelte.ts";

class Application {
  // todo: when a new viewport is added we need to trigger a re-draw on all
  // existing viewports (WebGL specifically), as the aspect ratio will change.
  ui: UI;

  constructor() {
    this.ui = new UI();
  }

  // this is not really planned, but if ever the app was to completely de-initialize and
  // re-initialize itself, we would call this method to cleanup the hanging effect.
  dealloc() {
    this.ui.dealloc();
  }
}

export default new Application();

// load a bunch of default settings and create a reactive effect
// which watches for changes and writes settings to local storage.
//new LocalStorage(app);

