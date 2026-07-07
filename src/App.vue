<!-- src/App.vue -->
<template>
  <div class="app-layout">
    <div
      v-if="sidebarOpen && isMobile"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>

    <nav class="sidebar" :class="{ open: sidebarOpen }">
      <h2>Vue3 组件通信</h2>
      <ul>
        <li v-for="(page, index) in pages" :key="page.path">
          <router-link :to="page.path" @click="isMobile && (sidebarOpen = false)">
            {{ index + 1 }}. {{ page.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <main class="content">
      <div class="content-header">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const pages = router
  .getRoutes()
  .filter((r) => r.path !== "/")
  .map((r) => ({
    path: r.path,
    name: (r.meta?.title as string) || r.name,
  }));

const sidebarOpen = ref(true);
const isMobile = ref(false);

let mq: MediaQueryList | null = null;
function checkMobile(e: MediaQueryListEvent | MediaQueryList) {
  isMobile.value = e.matches;
  if (e.matches) sidebarOpen.value = false;
  else sidebarOpen.value = true;
}

onMounted(() => {
  mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", checkMobile);
  checkMobile(mq);
});

onUnmounted(() => {
  mq?.removeEventListener("change", checkMobile);
});
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar-overlay {
  display: none;
}

.sidebar {
  width: 240px;
  background-color: #ffffff;
  border-right: 1px solid #e8e8e8;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  max-height: 100vh;
  flex-shrink: 0;
  transition: transform 0.25s ease;
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

.sidebar a {
  text-decoration: none;
  color: #555;
  display: block;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar a:hover {
  background-color: #e6f7ff;
}

.sidebar a.router-link-active {
  background-color: #1890ff;
  color: #fff;
  font-weight: bold;
}

.menu-toggle {
  display: none;
}

.content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .menu-toggle {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    border: none;
    background: none;
    cursor: pointer;
    margin-bottom: 16px;
  }

  .menu-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background-color: #333;
    border-radius: 2px;
  }

  .content {
    padding: 16px;
  }

  .content-header {
    display: flex;
    align-items: center;
  }
}
</style>
