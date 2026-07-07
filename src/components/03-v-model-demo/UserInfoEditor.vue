<!-- src/components/v-model-demo/UserInfoEditor.vue -->
<template>
  <div class="user-info-editor">
    <CustomInput
      label="姓 (First Name):"
      :modelValue="firstName"
      @update:modelValue="emit('update:firstName', $event)"
    />
    <CustomInput
      label="名 (Last Name):"
      :modelValue="lastName"
      @update:modelValue="emit('update:lastName', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import CustomInput from "./CustomInput.vue";

defineProps<{ firstName: string; lastName: string }>();

const emit = defineEmits<{
  (e: "update:firstName", value: string): void;
  (e: "update:lastName", value: string): void;
}>();
</script>

<style scoped>
.user-info-editor {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: aqua;
}
</style>
