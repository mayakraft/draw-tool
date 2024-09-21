class GridSettings {
  verticalUp: boolean = $state(true);
  showGrid: boolean = $state(true);
  showAxes: boolean = $state(true);
  pattern: string = $state("square"); // square or triangle

  constructor() {
    this.verticalUp = localStorage.getItem("grid-vertical-up") !== null
      ? localStorage.getItem("grid-vertical-up") === "true"
      : true;
    this.showGrid = localStorage.getItem("grid-show-grid") !== null
      ? localStorage.getItem("grid-show-grid") === "true"
      : true;
    this.showAxes = localStorage.getItem("grid-show-axes") !== null
      ? localStorage.getItem("grid-show-axes") === "true"
      : true;
    this.pattern = localStorage.getItem("grid-pattern") || "square";

    $effect.root(() => {
      $effect(() => {
        localStorage.setItem("grid-vertical-up", String(this.verticalUp));
        localStorage.setItem("grid-show-grid", String(this.showGrid));
        localStorage.setItem("grid-show-axes", String(this.showAxes));
        localStorage.setItem("grid-pattern", this.pattern);
      });
      return () => {};
    });
  }
}

export default (new GridSettings());

