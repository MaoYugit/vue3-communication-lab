<template>
  <ComponentDemoLayout>
    <!-- 1. 知识点介绍 -->
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>

    <!-- 2. 在线演示 -->
    <template #demo>
      <div class="parent-component">
        <h3>父组件</h3>
        <div class="input-area">
          <label>在父组件中修改消息:</label>
          <input v-model="parentMessage" />
        </div>
        <p>
          从子组件收到的消息: <span class="message">{{ childMessage }}</span>
        </p>

        <ChildComponent :message="parentMessage" @message-from-child="handleChildMessage" />
      </div>
    </template>

    <!-- 3. 核心代码 -->
    <template #code>
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
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import ChildComponent from "@/components/props-emit-demo/ChildComponent.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/01-props-emit.md?raw";

const parentMessage = ref("来自父组件的初始消息");
const childMessage = ref("暂未收到子组件消息");

function handleChildMessage(payload: string) {
  childMessage.value = payload || "子组件发送了空消息";
}

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
