import { mount } from "svelte";
import "./style/app.css";
import "./style/colors.css";
import "./style/svg.css";
import App from "./components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
