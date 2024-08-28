import { boundingBox } from "rabbit-ear/math/polygon.js";
import { type Box } from "rabbit-ear/types.js";

class TouchManager {
	press: [number, number] | undefined = $state();
	release: [number, number] | undefined = $state();
	move: [number, number] | undefined = $state();
	drag: [number, number] | undefined = $state();

	reset() {
		this.move = undefined;
		this.drag = undefined;
		this.press = undefined;
		this.release = undefined;
	}
};

class ToolState {
	touches: TouchManager | undefined;
	shapes: { rect: Box | undefined } | undefined;
	unsub: Function[] = [];

	subscribe() {
		this.touches = new TouchManager();
		this.shapes = (() => {
			const box: Box | undefined = $derived.by(() => {
				if (!this.touches) { return undefined; }
				if (!this.touches.press || !this.touches.drag) { return undefined; }
				const points = [
					$state.snapshot(this.touches.press),
					$state.snapshot(this.touches.drag),
				];
				return boundingBox(points);
			});
			const rect: any = $derived(box && box.span
				? {
					x: box.min[0],
					y: box.min[1],
					width: box.span[0],
					height: box.span[1],
				} : undefined);
			return {
				get box() { return box; },
				get rect() { return rect; },
			};
		})();

		this.unsub = [this.doSelection()];
	}

	unsubscribe() {
		this.unsub.forEach((u) => u());
		this.unsub = [];
		this.touches = undefined;
		this.shapes = undefined;
		this.reset();
	}

	reset() {
		this.touches?.reset();
	}

	doSelection() {
		return $effect.root(() => {
			$effect(() => {
				if (!this.touches) { return; }
				if (this.touches.press && this.touches.release) {
					const points = [
						$state.snapshot(this.touches.press),
						$state.snapshot(this.touches.release),
					];
					console.log("make selection", ...points);
					this.reset();
				}
			});
			return () => { };
		});
	}
};

export default (new ToolState());
