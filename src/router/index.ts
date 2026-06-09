import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/props-emit",
    name: "Props & Emit",
    component: () => import("../views/PropsEmitView.vue"),
  },
  {
    path: "/v-model",
    name: "v-model",
    component: () => import("../views/VModelView.vue"),
  },
  {
    path: "/attrs",
    name: "$attrs",
    component: () => import("../views/AttrsView.vue"),
  },
  {
    path: "/ref-expose",
    name: "ref & defineExpose",
    component: () => import("../views/RefExposeView.vue"),
  },
  {
    path: "/provide-inject",
    name: "Provide & Inject",
    component: () => import("../views/ProvideInjectView.vue"),
  },
  {
    path: "/pinia",
    name: "Pinia",
    component: () => import("../views/PiniaView.vue"),
  },
  {
    path: "/mitt",
    name: "Mitt",
    component: () => import("../views/MittView.vue"),
  },
  {
    path: "/slots",
    name: "Slots",
    component: () => import("../views/SlotsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
