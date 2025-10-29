<!-- src/views/PropsEmitView.vue -->
<template>
  <div class="props-emit-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>1. Props & Emit</h1>
      <p>这是 Vue 中最基础也是最核心的通信方式，用于父子组件之间的数据传递。</p>
      <ul>
        <li>
          <strong>Props (属性)</strong>:
          数据从父组件单向流向子组件。子组件只能读取，不能修改。
        </li>
        <li>
          <strong>Emit (触发事件)</strong>:
          子组件通过触发自定义事件，将信息回传给父组件，形成通信闭环。
        </li>
      </ul>
    </section>

    <!-- 2. 演示区 -->
    <section class="demo-section">
      <h2>Live Demo</h2>
      <div class="parent-component">
        <h3>父组件</h3>
        <div class="input-area">
          <label>在父组件中修改消息:</label>
          <input v-model="parentMessage" />
        </div>
        <p>
          从子组件收到的消息: <span class="message">{{ childMessage }}</span>
        </p>

        <!-- 关键交互点 -->
        <ChildComponent
          :message="parentMessage"
          @message-from-child="handleChildMessage"
        />
      </div>
    </section>

    <!-- 3. 代码区 -->
    <section class="code-section">
      <h2>核心代码</h2>
      <div class="code-blocks">
        <div class="code-block">
          <h4>父组件 (PropsEmitView.vue)</h4>
          <pre><code>{{ parentCode }}</code></pre>
        </div>
        <div class="code-block">
          <h4>子组件 (ChildComponent.vue)</h4>
          <pre><code>{{ childCode }}</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChildComponent from "@/components/props-emit-demo/ChildComponent.vue";

// --- Demo Logic ---
const parentMessage = ref("来自父组件的初始消息");
const childMessage = ref("暂未收到子组件消息");

function handleChildMessage(payload: string) {
  childMessage.value = payload || "子组件发送了空消息";
}

// --- Code Snippets for Display ---
const parentCode = `
// 父组件中
const parentMessage = ref('...');

function handleChildMessage(payload) {
  childMessage.value = payload;
}

<ChildComponent 
  :message="parentMessage" 
  @message-from-child="handleChildMessage"
/>
`;

const childCode = `
// 子组件中
defineProps({
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['message-from-child']);

function sendMessage() {
  emit('message-from-child', '...');
}
`;
</script>

<style scoped>
.props-emit-view {
  max-width: 900px;
}

section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h1,
h2 {
  margin-top: 0;
}

.parent-component {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.input-area {
  margin-bottom: 15px;
}
.input-area label {
  margin-right: 10px;
}
.input-area input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.message {
  color: #d9534f;
  font-weight: bold;
}

.code-blocks {
  display: flex;
  gap: 20px;
}
.code-block {
  flex: 1;
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
