import { createRouter, createWebHistory } from "vue-router";

// 1. 定义路由组件。
// 我们稍后会创建这个文件
import HomeView from "../views/HomeView.vue";

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
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

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
