<template>
  <div class="child-component">
    <h3>子组件</h3>
    <p>
      从父组件收到的消息: <span class="message">{{ message }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<style scoped>
.child-component {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.message {
  color: #1890ff;
  font-weight: bold;
}
</style>
