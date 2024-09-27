import { SVGViewport } from "../../viewport/SVGViewport.svelte.ts";
import snap from "../../state/snap.svelte.ts";

export class SVGTouches {
  viewport: SVGViewport;

  #move: [number, number] | undefined = $state();
  #drag: [number, number] | undefined = $state();
  #press: [number, number] | undefined = $state();
  #release: [number, number] | undefined = $state();

  snapMove: [number, number] | undefined = $state();
  snapDrag: [number, number] | undefined = $state();
  snapPress: [number, number] | undefined = $state();
  snapRelease: [number, number] | undefined = $state();

  get move() {
    return this.#move;
  }
  get drag() {
    return this.#drag;
  }
  get press() {
    return this.#press;
  }
  get release() {
    return this.#release;
  }
  set move(v: [number, number] | undefined) {
    this.#move = v;
    this.snapMove = this.#move
      ? snap.snapToPoint(this.#move, this.viewport.snapRadius).coords
      : undefined;
  }
  set drag(v: [number, number] | undefined) {
    this.#drag = v;
    this.snapDrag = this.#drag
      ? snap.snapToPoint(this.#drag, this.viewport.snapRadius).coords
      : undefined;
  }
  set press(v: [number, number] | undefined) {
    this.#press = v;
    this.snapPress = this.#press
      ? snap.snapToPoint(this.#press, this.viewport.snapRadius).coords
      : undefined;
  }
  set release(v: [number, number] | undefined) {
    this.#release = v;
    this.snapRelease = this.#release
      ? snap.snapToPoint(this.#release, this.viewport.snapRadius).coords
      : undefined;
  }

  constructor(viewport: SVGViewport) {
    this.viewport = viewport;
  }

  reset() {
    this.move = undefined;
    this.drag = undefined;
    this.press = undefined;
    this.release = undefined;
    this.snapMove = undefined;
    this.snapDrag = undefined;
    this.snapPress = undefined;
    this.snapRelease = undefined;
  }
}
