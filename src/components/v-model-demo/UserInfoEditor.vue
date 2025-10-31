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

// 接收 'firstName' 和 'lastName' 两个 prop
defineProps(["firstName", "lastName"]);

// 声明 'update:firstName' 和 'update:lastName' 两个事件
const emit = defineEmits(["update:firstName", "update:lastName"]);
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
