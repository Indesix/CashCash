import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./pages/Home.vue";
import AddImmeubleForm from "./pages/AddImmeubleForm.vue";

const routes = [
    { path: '/', component: Home},
    { path: '/add-immeuble', component: AddImmeubleForm}
]

export const router = createRouter({routes, history: createWebHashHistory()});