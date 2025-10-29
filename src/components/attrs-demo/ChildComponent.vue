<!-- src/components/attrs-demo/ChildComponent.vue -->
<template>
  <div class="child-component">
    <h4>孙组件</h4>
    <p>我收到的所有属性 (来自 $attrs):</p>
    <ul>
      <!-- 遍历并显示 attrs 对象中的所有键值对 -->
      <li v-for="(value, key) in attrs" :key="key">
        <strong>{{ key }}:</strong> {{ value }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";

// 使用 useAttrs() 获取所有透传过来的属性
const attrs = useAttrs();
</script>

<style scoped>
.child-component {
  padding: 15px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}
ul {
  padding-left: 20px;
}
</style>
