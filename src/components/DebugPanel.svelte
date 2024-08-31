<script lang="ts">
	import { renderer } from "../stores/renderer.svelte.ts";
	import { model } from "../stores/model.svelte.ts";
	const logModel = () => { console.log($state.snapshot(model.elements)); };
</script>

	<hr />
	<p>debug</p>

	<input type="checkbox" id="verticalUp" checked={renderer.view.verticalUp}/>
	<label for="verticalUp">Y axis</label>

	<button onclick={logModel}>model</button>

	<hr />

<style>
	button {
		width: 100%;
		margin: 0;
		padding: 0.5rem;
	}
	p {
		margin: 0;
		padding: 0;
		opacity: 0.8;
		font-style: italic;
		font-weight: bold;
	}
</style>
