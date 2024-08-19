<script lang="ts">
	// import SvgCanvas from "./SVGCanvas.svelte";
	import SvgTouchCanvas from "./SVGTouchCanvas.svelte";
	import { modelElements } from "../stores/Model.svelte";
	let svg: SVGSVGElement;

	$effect(() => {
		while(svg.children.length) { svg.removeChild(svg.children[0]); }
		modelElements.elements.forEach(el => svg.appendChild(el));
	});
</script>

<!-- <SvgCanvas -->
<SvgTouchCanvas
	bind:svg={svg}
	onmousemove={(e) => console.log(e.point)}
	fill="none"
	stroke="white"
/>
