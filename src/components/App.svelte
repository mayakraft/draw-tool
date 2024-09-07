<script lang="ts">
	import Toolbar from "./Toolbar.svelte";
	import DebugPanel from "./DebugPanel.svelte";
	import Canvases from "./Canvases.svelte";
	import Events from "./Events.svelte";

	// the toolbar's scrollbar will cover up the buttons, flexbox doesn't
	// give space to account for the scrollbar, we have to create a listener
	// and manually add the padding by setting a css variable.
	let divToolbar: HTMLElement;

	// toolbar scrollbar stuff
	$effect(() => { // on mount
		const resizeObserver = new ResizeObserver(entries => {
			setTimeout(() => {
				const width = divToolbar.offsetWidth - divToolbar.clientWidth;
				document.documentElement.style.setProperty(
					"--toolbar-scrollbar-width", `${width}px`)
			}, 5);
		});
		resizeObserver.observe(divToolbar);
		return () => resizeObserver.unobserve(divToolbar);
	});
</script>

<Events />

<main class="vertical">
	<div class="gui horizontal">
		<div class="toolbar" role="toolbar" bind:this={divToolbar}>
			<Toolbar />
			<DebugPanel />
		</div>
		<div class="canvases">
			<Canvases />
		</div>
	</div>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		max-width: 100vw;
		max-height: 100vh;
		overflow: hidden;
		position: fixed;
	}
	.vertical {
		display: flex;
		flex-direction: column;
	}
	.horizontal {
		display: flex;
		flex-direction: row;
	}

	/* main children: the top-most level */
	.gui {
		width: 100%;
		flex: 1 1 auto;
		min-height: 0;
	}

	/* .gui children */
	.toolbar {
		height: 100%;
		width: calc(2rem * 2 + 0.15rem * 4 + var(--toolbar-scrollbar-width));
		flex: 0 0 auto;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.canvases {
		width: 100%;
		height: 100%;
		min-width: 0;
		flex: 1 1 auto;
	}

	/* colors */
	.toolbar {
		background-color: var(--background-1);
	}

	/* disable text-style drag and highlight on the buttons */
	.toolbar, .toolbar :global(*) {
		-webkit-user-select: none;
		user-select: none;
	}
</style>
