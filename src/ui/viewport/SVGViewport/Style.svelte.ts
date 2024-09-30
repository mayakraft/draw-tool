import { View } from "./View.svelte.ts";

export class Style {
  view: View;
  constructor(view: View) {
    this.view = view;
  }

  strokeWidthFactor = $state(0.001);
  strokeWidthMin = $state(0.001);
  vertexRadiusFactor = $state(0.00666);

  circleRadius = $derived.by(
    () => Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.vertexRadiusFactor,
  );

  strokeWidth = $derived.by(() =>
    Math.max(
      this.strokeWidthMin,
      Math.min(this.view.viewBox[2], this.view.viewBox[3]) * this.strokeWidthFactor,
    ),
  );

  strokeDashLength = $derived(this.strokeWidth * 8);
}

