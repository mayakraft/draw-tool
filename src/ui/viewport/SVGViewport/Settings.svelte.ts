//import keyboard from "../../../app/Keyboard.svelte.ts";
import keyboard from "../../../app/Keyboard.svelte.ts";
//import app from "../../../app/App.svelte.ts";

// these are global view settings
// one instance per app, these settings apply to any
// and all instances of SVGViewports
//
// I want to be able to access these variables through the terminal, which means,
// they should be somewhere accessible via the app variable, like: app.ui.types.SVGViewport.settings
//

class Settings {
  showGrid: boolean = $state(true);
  showAxes: boolean = $state(true);
  tiling: string = $state("square"); // square or triangle

  radialSnap = $derived(keyboard.shift);
  radialSnapDegrees: number = $state(22.5);
  radialSnapOffset: number = $state(0);
}

export default new Settings();
