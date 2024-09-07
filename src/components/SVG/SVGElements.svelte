<script lang="ts">
	import { shapeToElement, type Shape } from "../../stores/model.svelte.ts";

	type PropsType = {
		// elements: SVGElement[],
		elements: Shape[],
	};

	const {
		elements,
		...rest
	}: PropsType = $props();

	let g: SVGGElement;

	const svgElements = $derived(elements
		.map(shapeToElement)
		.filter(a => a !== undefined));

	const remove = (el: Element) => {
		while(el.children.length) { el.removeChild(el.children[0]); }
	};

	$effect(() => {
		remove(g);
		svgElements.forEach(el => g.appendChild(el));
	});
</script>

<g bind:this={g} {...rest} />
