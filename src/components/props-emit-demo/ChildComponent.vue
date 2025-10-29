<!-- src/components/props-emit-demo/ChildComponent.vue -->
<template>
  <div class="child-component">
    <h3>子组件</h3>
    <p>
      从父组件收到的消息: <span class="message">{{ message }}</span>
    </p>

    <div class="input-area">
      <input v-model="childMessage" placeholder="在这里输入消息发送给父组件" />
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 1. 【Props】使用 defineProps 声明从父组件接收一个名为 'message' 的 prop
// 我们使用对象语法进行类型校验，确保它是字符串且必填
defineProps({
  message: {
    type: String,
    required: true,
  },
});

// 2. 【Emit】使用 defineEmits 声明该组件会触发一个名为 'message-from-child' 的事件
const emit = defineEmits(["message-from-child"]);

// 用于绑定子组件输入框的本地响应式数据
const childMessage = ref("");

// 3. 点击按钮时，调用此方法
function sendMessage() {
  // 使用 emit 触发事件，并将 childMessage.value 作为载荷（payload）发送出去
  emit("message-from-child", childMessage.value);
  // 清空输入框
  childMessage.value = "";
}
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
.input-area {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #36a374;
}
</style>
