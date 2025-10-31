<!-- src/views/PiniaView.vue -->
<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>
    <template #demo>
      <!-- 2. 演示区 -->
      <section class="demo-section">
        <h2>Live Demo</h2>
        <p>下面这两个组件没有父子关系，它们通过同一个 Pinia Store 进行通信。</p>
        <div class="demo-container">
          <LoginStatus />
          <LoginControls />
        </div>
      </section>
    </template>
    <template #code>
      <!-- 3. 代码区 -->
      <section class="code-section">
        <h4>核心代码 (stores/userStore.ts)</h4>
        <pre><code>{{ storeCode }}</code></pre>
      </section>
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import LoginStatus from "@/components/pinia-demo/LoginStatus.vue";
import LoginControls from "@/components/pinia-demo/LoginControls.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/06-pinia.md?raw";
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
