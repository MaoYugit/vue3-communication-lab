<!-- src/components/mitt-demo/MittReceiver.vue -->
<template>
  <div class="receiver-component">
    <h4>事件接收器 (MittReceiver.vue)</h4>
    <div v-if="notification" class="notification" :class="notification.type">
      <p>
        <strong>{{ notification.type.toUpperCase() }}:</strong>
        {{ notification.message }}
      </p>
    </div>
    <p v-else class="placeholder">等待接收通知...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import emitter from "@/utils/emitter";

type NotificationPayload = {
  type: "success" | "warning" | "error";
  message: string;
};

const notification = ref<NotificationPayload | null>(null);

// 1. 定义一个处理函数
function handleNotification(payload: NotificationPayload) {
  notification.value = payload;
  clearTimeout(timer);
  // 3秒后自动清除通知
  timer = setTimeout(() => {
    notification.value = null;
  }, 3000);
}

// 2. 在组件挂载后，开始监听 'show-notification' 事件
onMounted(() => {
  emitter.on("show-notification", handleNotification);
});

// 3. ‼️‼️‼️ 最关键的一步：在组件卸载前，解绑事件监听器
onUnmounted(() => {
  emitter.off("show-notification", handleNotification);
  clearTimeout(timer);
});

let timer: ReturnType<typeof setTimeout>;
</script>

<style scoped>
.receiver-component {
  padding: 15px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  min-height: 100px;
}
.placeholder {
  color: #999;
}
.notification {
  padding: 10px 15px;
  border-radius: 4px;
  color: white;
}
.notification.success {
  background-color: #52c41a;
}
.notification.warning {
  background-color: #faad14;
}
.notification.error {
  background-color: #f5222d;
}
</style>
