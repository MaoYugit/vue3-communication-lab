<!-- src/components/mitt-demo/MittEmitter.vue -->
<template>
  <div class="emitter-component">
    <h4>事件发射器 (MittEmitter.vue)</h4>
    <p>点击下方按钮，通过 mitt 向整个应用广播事件。</p>
    <div class="buttons">
      <button class="success" @click="emitEvent('success', '操作成功！')">
        发送成功通知
      </button>
      <button class="warning" @click="emitEvent('warning', '这是一个警告。')">
        发送警告通知
      </button>
      <button class="error" @click="emitEvent('error', '发生了一个错误！')">
        发送错误通知
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import emitter from "@/utils/emitter";

type NotificationType = "success" | "warning" | "error";

function emitEvent(type: NotificationType, message: string) {
  // 触发一个全局事件，并附带一个包含类型和消息的对象
  emitter.emit("show-notification", { type, message });
}
</script>

<style scoped>
.emitter-component {
  padding: 15px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
}
.buttons button {
  margin-right: 10px;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  border: none;
}
.success {
  background-color: #52c41a;
}
.warning {
  background-color: #faad14;
}
.error {
  background-color: #f5222d;
}
</style>
