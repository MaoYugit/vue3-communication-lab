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
defineProps<{ modelValue?: string; label?: string }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
.custom-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: antiquewhite;
  padding: 10px;
  border-radius: 10px;
}
input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: antiquewhite;
}
</style>
