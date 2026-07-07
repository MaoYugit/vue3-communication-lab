<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>

    <template #demo>
      <div class="parent-component">
        <h3>父组件</h3>
        <p>
          从子组件收到的消息: <span class="message">{{ childMessage }}</span>
        </p>
        <ChildComponent @message-from-child="handleChildMessage" />
      </div>
    </template>

    <template #code>
      <div class="code-blocks">
        <div class="code-block">
          <h4>父组件 (EmitView.vue)</h4>
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
import ChildComponent from "@/components/02-emit-demo/ChildComponent.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/02-emit.md?raw";
import parentCode from "@/views/02-Emit/EmitView.vue?raw";
import childCode from "@/components/02-emit-demo/ChildComponent.vue?raw";

const childMessage = ref("暂未收到子组件消息");

function handleChildMessage(payload: string) {
  childMessage.value = payload || "子组件发送了空消息";
}
</script>

<style scoped>
.parent-component {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
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
