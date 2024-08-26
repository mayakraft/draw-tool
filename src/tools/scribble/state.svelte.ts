
class SVGShapes {
	circle: { cx: number, cy: number, r: number } | undefined = $derived((
		!touches.presses.length || !touches.drag
			? undefined
			: makeCircle(touches.presses[touches.presses.length - 1], touches.drag)));
};

export const svgShapes = new SVGShapes();
