<!-- src/components/pinia-demo/LoginStatus.vue -->
<template>
  <div class="login-status">
    <h4>状态展示组件 (LoginStatus.vue)</h4>
    <!-- 直接使用 store 的 getter -->
    <p>{{ userStore.welcomeMessage }}</p>
    <div v-if="isLoggedIn" class="user-info">
      <!-- 解构出来的 ref，在模板中可以直接使用 -->
      <p><strong>Email:</strong> {{ userInfo.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

// 使用 storeToRefs 来解构 state 和 getters，以保持其响应性
const { isLoggedIn, userInfo } = storeToRefs(userStore);
</script>

<style scoped>
.login-status {
  padding: 15px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}
.user-info {
  font-size: 0.9em;
}
</style>
