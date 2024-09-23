// these are global view settings, single settings which apply to
// all viewports or all tools.
// for example "show grid" is a setting

export class ViewSettings {
	showGrid: boolean = $state(true);
	showAxes: boolean = $state(true);
}
