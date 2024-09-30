import keyboard from "../../../app/keyboard.svelte.ts";

// these are global view settings
// one instance per app, these settings apply to any
// and all instances of SVGViewports
//
// I want to be able to access these variables through the terminal, which means,
// they should be somewhere accessible via the app variable, like: app.ui.types.SVGViewport.settings
//

class Settings {
  // is the Y axis on top (true) or on bottom (false)?
  rightHanded: boolean = $state(true);

  // the unit grid that contributes to snap points ("square" or "triangle")
  tiling: string = $state("square");

  showGrid: boolean = $state(true);
  showAxes: boolean = $state(true);

  radialSnap: boolean = $derived(keyboard.shift);
  radialSnapDegrees: number = $state(22.5);
  radialSnapOffset: number = $state(0);
}

export default new Settings();

