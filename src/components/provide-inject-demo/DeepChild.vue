<!-- src/components/provide-inject-demo/DeepChild.vue -->
<template>
  <!-- 
    根据注入的主题动态改变 class。
    在 scoped style 中，我们可以用 :deep() 选择器来影响子组件的样式，
    但这里我们直接绑定 class 并在父组件中定义样式更简单。
  -->
  <div class="deep-child" :class="theme">
    <h4>孙组件</h4>
    <p>
      我通过 <code>inject</code> 直接获取了顶层组件提供的主题:
      <span class="value">{{ theme }}</span>
    </p>
    <button @click="toggleTheme">点我切换主题 (调用顶层方法)</button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import type { Ref } from "vue";

// 定义期望注入的类型，提供更好的类型安全
interface ThemeContext {
  theme: Ref<string>;
  toggleTheme: () => void;
}

// 注入顶层提供的 'themeContext'
// 提供一个默认值以防万一，这让组件更健壮
const { theme, toggleTheme } = inject<ThemeContext>("themeContext", {
  theme: ref("default"),
  toggleTheme: () => console.warn("toggleTheme not provided"),
});
</script>

<style scoped>
.deep-child {
  padding: 15px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid;
}
.value {
  font-weight: bold;
  text-transform: uppercase;
}
button {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid;
}

/* 主题样式 */
.light {
  background-color: #f0f9ff;
  border-color: #d9ecff;
  color: #333;
}
.light button {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}
.dark {
  background-color: #333;
  border-color: #666;
  color: #fff;
}
.dark button {
  background-color: #555;
  border-color: #888;
  color: #fff;
}
</style>
