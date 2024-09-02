<script lang="ts">
	import { onkeydown, onkeyup } from "../stores/keyboardEvents.svelte";
</script>

<svelte:window {onkeyup} {onkeydown} />
