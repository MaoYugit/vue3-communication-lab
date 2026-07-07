<!-- src/views/ProvideInjectView.vue -->
<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>
    <template #demo>
      <!-- 2. 演示区 -->
      <section class="demo-section">
        <h2>Live Demo</h2>
        <div class="grandparent-component" :class="theme">
          <h2>祖父组件 (Provider)</h2>
          <p>
            当前主题: <span class="value">{{ theme }}</span>
          </p>
          <p>我在这一层 provide 数据和方法，请看最深处的孙组件如何响应。</p>

          <MiddleComponent />
        </div>
      </section>
    </template>
    <template #code>
      <!-- 3. 代码区 -->
      <section class="code-section">
        <h2>核心代码</h2>
        <div class="code-blocks">
          <div class="code-block">
            <h4>祖父组件 (ProvideInjectView.vue)</h4>
            <pre><code>{{ providerCode }}</code></pre>
          </div>
          <div class="code-block">
            <h4>孙组件 (DeepChild.vue)</h4>
            <pre><code>{{ consumerCode }}</code></pre>
          </div>
        </div>
      </section>
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import { ref, provide, readonly } from "vue";
import MiddleComponent from "@/components/06-provide-inject-demo/MiddleComponent.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/05-provide 与 inject.md?raw";
import providerCode from "@/views/ProvideInject/ProvideInjectView.vue?raw";
import consumerCode from "@/components/06-provide-inject-demo/DeepChild.vue?raw";
import { themeContextKey } from "@/components/06-provide-inject-demo/themeContext";
// --- Demo Logic ---
// 1. 创建一个响应式的数据 (ref)
const theme = ref("light");

// 2. 创建一个可以修改数据的方法
function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

// 3. 使用 provide 将数据和方法提供给所有后代组件
// 使用 Symbol 作为 key 是一个好习惯，但在简单示例中用字符串也可以
provide(themeContextKey, {
  theme: readonly(theme), // 使用 readonly 包装，防止子组件直接修改
  toggleTheme,
});
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
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid;
}
.value {
  font-weight: bold;
  text-transform: uppercase;
}
.light {
  background-color: #fff;
  border-color: #eee;
  color: #333;
}
.dark {
  background-color: #222;
  border-color: #555;
  color: #fff;
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
