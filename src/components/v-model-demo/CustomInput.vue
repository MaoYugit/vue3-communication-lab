<!-- src/components/v-model-demo/CustomInput.vue -->
<template>
  <div class="custom-input">
    <label v-if="label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      placeholder="这是一个自定义输入框"
    />
  </div>
</template>

<script setup lang="ts">
// 1. 接收 modelValue prop
// 2. 接收一个可选的 label prop，让组件更通用
defineProps({
  modelValue: String,
  label: String,
});

// 3. 声明 update:modelValue 事件
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.custom-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
