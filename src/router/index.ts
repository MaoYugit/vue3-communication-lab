import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { title: "Home" },
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/props",
    name: "Props",
    meta: { title: "Props" },
    component: () => import("../views/01-Props/PropsView.vue"),
  },
  {
    path: "/emit",
    name: "Emit",
    meta: { title: "Emit" },
    component: () => import("../views/02-Emit/EmitView.vue"),
  },
  {
    path: "/v-model",
    name: "v-model",
    meta: { title: "v-model" },
    component: () => import("../views/03-V-model/VModelView.vue"),
  },
  {
    path: "/attrs",
    name: "$attrs",
    meta: { title: "$attrs" },
    component: () => import("../views/04-Attrs/AttrsView.vue"),
  },
  {
    path: "/ref-expose",
    name: "ref & defineExpose",
    meta: { title: "ref & defineExpose" },
    component: () => import("../views/05-RefExpose/RefExposeView.vue"),
  },
  {
    path: "/provide-inject",
    name: "Provide & Inject",
    meta: { title: "Provide & Inject" },
    component: () => import("../views/06-ProvideInject/ProvideInjectView.vue"),
  },
  {
    path: "/pinia",
    name: "Pinia",
    meta: { title: "Pinia" },
    component: () => import("../views/07-Pinia/PiniaView.vue"),
  },
  {
    path: "/mitt",
    name: "Mitt",
    meta: { title: "Mitt" },
    component: () => import("../views/08-Mitt/MittView.vue"),
  },
  {
    path: "/slots",
    name: "Slots",
    meta: { title: "Slots" },
    component: () => import("../views/09-Slot/SlotsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const pageTitle = to.meta.title;
  const siteName = "vue3-communication-lab";

  if (pageTitle) {
    if (to.name === "Home") {
      document.title = `${siteName}`;
    } else {
      document.title = `${pageTitle} | ${siteName}`;
    }
  } else {
    document.title = siteName;
  }
});

export default router;
