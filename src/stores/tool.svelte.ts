import { type Tool } from "../types.ts";

/**
 * @description This is the currently selected UI tool, as seen on the
 * toolbar (left side of screen). Tool definitions can be found inside
 * the tools/ folder.
 * @notes The tool setter will reset the UI between tools and
 * call any "subscribe" or "unsubscribe" methods, if they exist,
 * intended to cleanup or initialize Svelte stores which are specific
 * to each tool.
 */
export const tool = (() => {
	let value = $state<Tool | undefined>(undefined);
	return {
		get value() { return value; },
		set value(newTool) {
			if (value && value.state && value.state.unsubscribe) {
				value.state.unsubscribe();
			}
			// resetUI();
			if (newTool && newTool.state && newTool.state.subscribe) {
				newTool.state.subscribe();
			}
			value = newTool;
		},
	};
})();

/**
 * @description This will reset all visual feedback coming from the UI,
 * for example, this is called when switching between UI tools to reset
 * all visual feedback.
 */
export const resetUI = () => {
	// Pointer.set(undefined);
	// SnapPoint.set(undefined);
	// Highlight.reset();
	// GhostGraphCP.set({});
	// GuideLinesCP.set([]);
	// UILines.set([]);
	// UIRays.set([]);
	// UISegment.set([]);
	// RulersCP.set([]);
};
