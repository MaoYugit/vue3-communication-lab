<!-- src/components/ref-expose-demo/MyForm.vue -->
<template>
  <div class="my-form">
    <h3>子组件 (MyForm.vue)</h3>
    <div class="form-item">
      <label>用户名:</label>
      <input v-model="username" placeholder="用户名不能为空" />
    </div>
    <div class="form-item">
      <label>密码:</label>
      <input v-model="password" type="password" placeholder="密码不能少于6位" />
    </div>
    <p class="internal-state">内部校验状态: {{ validationStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");
const validationStatus = ref("待校验");

// 这是一个内部方法，父组件无法访问
function runValidationLogic() {
  if (!username.value) {
    validationStatus.value = "失败：用户名不能为空！";
    return false;
  }
  if (password.value.length < 6) {
    validationStatus.value = "失败：密码长度不能少于6位！";
    return false;
  }
  validationStatus.value = "成功！";
  return true;
}

// 关键点：使用 defineExpose 暴露一个公共方法
defineExpose({
  // 将内部的校验逻辑包装成一个名为 validate 的公共方法暴露出去
  validate: runValidationLogic,
});
</script>

<style scoped>
.my-form {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.form-item {
  margin-bottom: 15px;
}
.form-item label {
  display: inline-block;
  width: 80px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.internal-state {
  font-style: italic;
  color: #888;
}
</style>
