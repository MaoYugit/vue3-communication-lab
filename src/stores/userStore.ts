// src/stores/userStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Composition API (setup store) 写法
// 这是 Pinia 官方更推荐的写法，因为它能更好地利用组合式 API 的优势
export const useUserStore = defineStore("user", () => {
  // --- State ---
  const isLoggedIn = ref(false);
  const userInfo = ref({
    name: "",
    email: "",
  });

  // --- Getters ---
  const welcomeMessage = computed(() => {
    return isLoggedIn.value
      ? `欢迎回来, ${userInfo.value.name}!`
      : "你好, 游客!";
  });

  // --- Actions ---
  function login(name: string, email: string) {
    isLoggedIn.value = true;
    userInfo.value = { name, email };
  }

  function logout() {
    isLoggedIn.value = false;
    userInfo.value = { name: "", email: "" };
  }

  // 必须返回所有需要暴露给外部的状态、getters 和 actions
  return {
    isLoggedIn,
    userInfo,
    welcomeMessage,
    login,
    logout,
  };
});
