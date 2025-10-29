<!-- src/components/attrs-demo/ParentComponent.vue -->
<template>
  <div class="parent-component">
    <h3>父组件</h3>
    <p>
      我只接收 'title' prop: <span class="value">{{ title }}</span>
    </p>
    <p>剩下的属性 ($attrs) 我将全部透传给子组件:</p>

    <!-- 关键点：使用 v-bind="$attrs" 将所有未被 props 接收的属性继续向下传递 -->
    <ChildComponent v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import ChildComponent from "./ChildComponent.vue";

// 父组件只声明接收 'title' 这一个 prop
defineProps({
  title: String,
});

// Vue 3 推荐的做法，明确禁用属性继承，因为我们是手动 v-bind
defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.parent-component {
  padding: 20px;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
}
.value {
  color: #faad14;
  font-weight: bold;
}
</style>
