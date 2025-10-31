<template>
  <!-- 1. 使用我们创建的布局组件作为根元素 -->
  <ComponentDemoLayout>
    <!-- 2. 使用 <template> 标签和 # 插槽语法来填充内容 -->
    <!-- 下面的 #introduction 对应布局组件里的 <slot name="introduction"> -->
    <template #introduction>
      <!-- 这里是“介绍区”的所有内容 -->
      <MarkdownRenderer :source="introductionContent" />
    </template>

    <!-- #demo 对应 <slot name="demo"> -->
    <template #demo>
      <!-- 这里是“演示区”的所有内容 -->
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
    </template>

    <!-- #code 对应 <slot name="code"> -->
    <template #code>
      <!-- 这里是“代码区”的所有内容 -->
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
// 3. 引入我们新创建的布局组件
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import ChildComponent from "@/components/props-emit-demo/ChildComponent.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/01-props-emit.md?raw";

// --- Demo Logic (这部分逻辑保持不变) ---
const parentMessage = ref("来自父组件的初始消息");
const childMessage = ref("暂未收到子组件消息");

function handleChildMessage(payload: string) {
  childMessage.value = payload || "子组件发送了空消息";
}

// --- Code Snippets for Display (这部分也保持不变) ---
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
