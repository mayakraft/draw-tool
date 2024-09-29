//import type { AppSettings } from "./app.svelte.ts";

// consider joining this with Settings

//export class LocalStorage {
//	constructor(app: Application) {
//		 app.viewSettings.verticalUp =
//		 	localStorage.getItem("grid-vertical-up") !== null
//		 		? localStorage.getItem("grid-vertical-up") === "true"
//		 		: true;
//		 app.viewSettings.showGrid =
//		 	localStorage.getItem("grid-show-grid") !== null
//		 		? localStorage.getItem("grid-show-grid") === "true"
//		 		: true;
//		 app.viewSettings.showAxes =
//		 	localStorage.getItem("grid-show-axes") !== null
//		 		? localStorage.getItem("grid-show-axes") === "true"
//		 		: true;
//		 this.tiling = localStorage.getItem("grid-tiling") || "square";
//		 $effect.root(() => {
//		 	$effect(() => {
//		 		localStorage.setItem("grid-vertical-up", String(this.verticalUp));
//		 		localStorage.setItem("grid-show-grid", String(this.showGrid));
//		 		localStorage.setItem("grid-show-axes", String(this.showAxes));
//		 		localStorage.setItem("grid-pattern", this.pattern);
//		 	});
//		 	return () => {};
//		 });
//	}
//}
