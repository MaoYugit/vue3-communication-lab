<!-- src/components/pinia-demo/LoginControls.vue -->
<template>
  <div class="login-controls">
    <h4>操作控制组件 (LoginControls.vue)</h4>
    <p>这两个按钮会调用 Pinia store 的 actions。</p>
    <button @click="handleLogin" :disabled="userStore.isLoggedIn">登录</button>
    <button @click="handleLogout" :disabled="!userStore.isLoggedIn">
      退出
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

function handleLogin() {
  userStore.login("Coder Gemini", "gemini@google.com");
}

function handleLogout() {
  userStore.logout();
}
</script>

<style scoped>
.login-controls {
  padding: 15px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
}
button {
  margin-right: 10px;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
