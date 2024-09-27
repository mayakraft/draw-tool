<script lang="ts">
	import { onkeydown, onkeyup } from "../state/keyboardEvents.svelte";
</script>

<svelte:window {onkeyup} {onkeydown} />

