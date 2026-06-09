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
    component: () => import("../views/Props/PropsEmitView.vue"),
  },
  {
    path: "/v-model",
    name: "v-model",
    component: () => import("../views/V-model/VModelView.vue"),
  },
  {
    path: "/attrs",
    name: "$attrs",
    component: () => import("../views/Attrs/AttrsView.vue"),
  },
  {
    path: "/ref-expose",
    name: "ref & defineExpose",
    component: () => import("../views/RefExpose/RefExposeView.vue"),
  },
  {
    path: "/provide-inject",
    name: "Provide & Inject",
    component: () => import("../views/ProvideInject/ProvideInjectView.vue"),
  },
  {
    path: "/pinia",
    name: "Pinia",
    component: () => import("../views/Pinia/PiniaView.vue"),
  },
  {
    path: "/mitt",
    name: "Mitt",
    component: () => import("../views/Mitt/MittView.vue"),
  },
  {
    path: "/slots",
    name: "Slots",
    component: () => import("../views/Slot/SlotsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
