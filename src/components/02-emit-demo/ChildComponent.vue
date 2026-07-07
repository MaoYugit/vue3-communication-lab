<template>
  <div class="child-component">
    <h3>子组件</h3>
    <div class="input-area">
      <input v-model="childMessage" placeholder="在这里输入消息发送给父组件" />
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "message-from-child", payload: string): void;
}>();

const childMessage = ref("");

function sendMessage() {
  emit("message-from-child", childMessage.value);
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
