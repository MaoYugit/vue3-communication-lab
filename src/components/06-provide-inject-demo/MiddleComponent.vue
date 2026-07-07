<!-- src/components/provide-inject-demo/MiddleComponent.vue -->
<template>
  <div class="middle-component">
    <h3>父组件 (中间层)</h3>
    <p>我是一个“绝缘”的中间组件，我不需要知道关于主题的任何事。</p>
    <p>但我会把我自己的子组件渲染出来:</p>
    <DeepChild />
  </div>
</template>

<script setup lang="ts">
// 这个组件完全不需要引入 provide 或 inject
import DeepChild from "./DeepChild.vue";
</script>

<style scoped>
.middle-component {
  padding: 20px;
  background-color: #f3f3f3;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
}
</style>
