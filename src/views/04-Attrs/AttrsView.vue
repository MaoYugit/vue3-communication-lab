<!-- src/views/AttrsView.vue -->
<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>
    <template #demo>
      <!-- 2. 演示区 -->
      <section class="demo-section">
        <h2>Live Demo</h2>
        <div class="grandparent-component">
          <h2>祖父组件</h2>
          <p>我将传递以下所有属性给父组件:</p>
          <ul>
            <li><code>title</code> (父组件会接收)</li>
            <li><code>message</code> (将透传给孙组件)</li>
            <li><code>user-id</code> (将透传给孙组件)</li>
            <li><code>is-active</code> (将透传给孙组件)</li>
          </ul>

          <!-- 
          我们在这里传递了 4 个属性。
          ParentComponent 只会接收 title。
          剩下的 3 个会进入 ParentComponent 的 $attrs，
          并被 v-bind="$attrs" 传递给 ChildComponent。
        -->
          <ParentComponent
            title="一个重要的标题"
            message="这是要给孙子的秘密消息"
            :user-id="123"
            :is-active="true"
          />
        </div>
      </section>
    </template>
    <template #code>
      <!-- 3. 代码区 -->
      <section class="code-section">
        <h4>核心代码 (ParentComponent.vue)</h4>
        <pre><code>{{ parentCode }}</code></pre>
      </section></template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import ParentComponent from "@/components/04-attrs-demo/ParentComponent.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/03-$attrs.md?raw";
import parentCode from "@/components/04-attrs-demo/ParentComponent.vue?raw";
</script>

<style scoped>
section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.grandparent-component {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
ul {
  line-height: 1.8;
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
