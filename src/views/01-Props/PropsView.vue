<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>

    <template #demo>
      <div class="parent-component">
        <h3>父组件</h3>
        <div class="input-area">
          <label>在父组件中修改消息:</label>
          <input v-model="parentMessage" />
        </div>
        <ChildComponent :message="parentMessage" />
      </div>
    </template>

    <template #code>
      <div class="code-blocks">
        <div class="code-block">
          <h4>父组件 (PropsView.vue)</h4>
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
import ChildComponent from "@/components/01-props-demo/ChildComponent.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/01-props.md?raw";
import parentCode from "@/views/01-Props/PropsView.vue?raw";
import childCode from "@/components/01-props-demo/ChildComponent.vue?raw";

const parentMessage = ref("来自父组件的初始消息");
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
