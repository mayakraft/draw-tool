/**
 * @description Walk up the chain of parents of a DOM element
 * until we find an element with a .nodeName property matching
 * the supplied parameter. Return the matching element, or undefined.
 */
export const findInParents = (element: Element, nodeName: string):Element => {
	if ((element.nodeName || "") === nodeName) {
		return element;
	}
	return element.parentNode
		? findInParents(element.parentNode, nodeName)
		: undefined;
};

/**
 * @description Convert a 2D point coordinates from screen/canvas/
 * pixel units, into viewBox units.
 */
export const convertToViewBox = (svg: SVGSVGElement, [x, y]: [number, number]): [number, number] => {
	const pt = svg.createSVGPoint();
	// transform: matrix(1, 0, 0, -1, 0, 1);
	pt.x = x;
	pt.y = y;
	// todo: i thought this threw an error once. something about getScreenCTM.
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};
