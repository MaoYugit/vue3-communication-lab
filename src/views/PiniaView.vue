<!-- src/views/PiniaView.vue -->
<template>
  <div class="pinia-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>6. Pinia</h1>
      <p>
        Pinia 是 Vue
        官方推荐的状态管理库。它允许你创建集中的、全局共享的“数据仓库”(Store)，让任何组件都能方便地读取和修改状态，非常适合管理如用户信息、购物车等全局数据。
      </p>
      <ul>
        <li><strong>State:</strong> 核心数据源 (响应式)。</li>
        <li><strong>Getters:</strong> 基于 State 的计算属性 (带缓存)。</li>
        <li><strong>Actions:</strong> 修改 State 的方法 (可以是异步的)。</li>
      </ul>
    </section>

    <!-- 2. 演示区 -->
    <section class="demo-section">
      <h2>Live Demo</h2>
      <p>下面这两个组件没有父子关系，它们通过同一个 Pinia Store 进行通信。</p>
      <div class="demo-container">
        <LoginStatus />
        <LoginControls />
      </div>
    </section>

    <!-- 3. 代码区 -->
    <section class="code-section">
      <h4>核心代码 (stores/userStore.ts)</h4>
      <pre><code>{{ storeCode }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import LoginStatus from "@/components/pinia-demo/LoginStatus.vue";
import LoginControls from "@/components/pinia-demo/LoginControls.vue";

const storeCode = `
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const isLoggedIn = ref(false);
  const userInfo = ref({ name: '', email: '' });

  // Getters
  const welcomeMessage = computed(() => {
    return isLoggedIn.value 
      ? \`欢迎回来, \${userInfo.value.name}!\` 
      : '你好, 游客!';
  });

  // Actions
  function login(name: string, email: string) {
    isLoggedIn.value = true;
    userInfo.value = { name, email };
  }

  function logout() {
    isLoggedIn.value = false;
    userInfo.value = { name: '', email: '' };
  }

  return { isLoggedIn, userInfo, welcomeMessage, login, logout };
});
`;
</script>

<style scoped>
.pinia-view {
  max-width: 900px;
}
section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.demo-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
pre {
  background-color: #2d2d2d;
  color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
