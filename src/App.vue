<!-- src/App.vue -->
<template>
  <div class="app-layout">
    <nav class="sidebar">
      <h2>Vue3 组件通信</h2>
      <ul>
        <li v-for="page in pages" :key="page.path">
          <router-link :to="page.path">{{ page.name }}</router-link>
        </li>
      </ul>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 1. 定义我们的导航链接信息
const pages = [
  { path: "/", name: "首页" },
  { path: "/props-emit", name: "1. Props & Emit" },
  { path: "/v-model", name: "2. v-model" },
  { path: "/attrs", name: "3. $attrs" },
  { path: "/ref-expose", name: "4. ref & defineExpose" },
  { path: "/provide-inject", name: "5. Provide & Inject" },
  { path: "/pinia", name: "6. Pinia" },
  { path: "/mitt", name: "7. Mitt" },
  { path: "/slots", name: "8. Slots" },
];
</script>

<style scoped>
/* 使用 scoped 确保样式只作用于当前组件 */
.app-layout {
  display: flex;
  height: 100vh;
  /* 占满整个视口高度 */
  background-color: #f0f2f5;
}

.sidebar {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar h2 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #333;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

/* 路由链接样式 */
.sidebar a {
  text-decoration: none;
  color: #555;
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

/* 鼠标悬停时的样式 */
.sidebar a:hover {
  background-color: #e6f7ff;
}

/* 当前激活的路由链接样式 */
.sidebar a.router-link-active {
  background-color: #1890ff;
  color: #fff;
  font-weight: bold;
}

.content {
  flex-grow: 1;
  /* 占据剩余所有空间 */
  padding: 30px;
  overflow-y: auto;
  /* 如果内容超长，则可以滚动 */
}
</style>
