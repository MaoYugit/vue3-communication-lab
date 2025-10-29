<!-- src/views/MittView.vue -->
<template>
  <div class="mitt-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>7. Mitt (Event Bus)</h1>
      <p>
        <code>mitt</code>
        是一个轻量级的事件总线库，它实现了全局的发布/订阅模式。任何组件都可以触发
        (emit) 一个全局事件，其他任何组件都可以监听 (on)
        这个事件，从而实现任意组件间的通信。
      </p>
      <p class="warning">
        <strong>⚠️ 注意:</strong>
        事件总线容易导致数据流混乱，难以追踪，并且有内存泄漏的风险。请谨慎使用，对于复杂场景，<strong
          >Pinia 是更好的选择</strong
        >。
      </p>
    </section>

    <!-- 2. 演示区 -->
    <section class="demo-section">
      <h2>Live Demo</h2>
      <p>
        下面这两个组件没有父子关系。左边的组件会广播事件，右边的组件会监听并显示通知。
      </p>
      <div class="demo-container">
        <MittEmitter />
        <MittReceiver />
      </div>
    </section>

    <!-- 3. 代码区 -->
    <section class="code-section">
      <h4>核心代码 (MittReceiver.vue - 事件监听方)</h4>
      <pre><code>{{ receiverCode }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import MittEmitter from "@/components/mitt-demo/MittEmitter.vue";
import MittReceiver from "@/components/mitt-demo/MittReceiver.vue";

const receiverCode = `
import { onMounted, onUnmounted } from 'vue';
import emitter from '@/utils/emitter';

// 定义处理函数
function handleNotification(payload) {
  // ... 更新组件状态以显示通知 ...
}

// 组件挂载时，订阅事件
onMounted(() => {
  emitter.on('show-notification', handleNotification);
});

// ‼️ 组件卸载时，必须取消订阅，防止内存泄漏！
onUnmounted(() => {
  emitter.off('show-notification', handleNotification);
});
`;
</script>

<style scoped>
.mitt-view {
  max-width: 900px;
}

section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.warning {
  padding: 10px;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
}

.demo-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

pre {
  background-color: #2d2d2d;
  color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
