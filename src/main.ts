import { mount } from "svelte";
import "./app.css";
import "./colors.css";
import App from "./components/App.svelte";

const app = mount(App, { target: document.getElementById("app")! });

export default app;
