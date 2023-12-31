import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const router = createRouter({
  history: createWebHistory(),
  routes: routes, // short for `routes: routes`
});
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).use(router).mount("#app");
