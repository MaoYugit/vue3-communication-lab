<!-- src/views/ProvideInjectView.vue -->
<template>
  <div class="provide-inject-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>5. Provide & Inject</h1>
      <p>
        <code>provide</code> 和
        <code>inject</code> 用于解决跨越多层级的组件通信问题（即“属性钻孔” Prop
        Drilling）。祖先组件作为“提供者”(Provider)，其所有后代组件都可以作为“注入者”(Consumer)来获取这份数据，无论层级多深。
      </p>
    </section>

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
  </div>
</template>

<script setup lang="ts">
import { ref, provide, readonly } from "vue";
import MiddleComponent from "@/components/provide-inject-demo/MiddleComponent.vue";

// --- Demo Logic ---
// 1. 创建一个响应式的数据 (ref)
const theme = ref("light");

// 2. 创建一个可以修改数据的方法
function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

// 3. 使用 provide 将数据和方法提供给所有后代组件
// 使用 Symbol 作为 key 是一个好习惯，但在简单示例中用字符串也可以
provide("themeContext", {
  theme: readonly(theme), // 使用 readonly 包装，防止子组件直接修改
  toggleTheme,
});

// --- Code Snippets for Display ---
const providerCode = `
// 祖父组件中
import { ref, provide, readonly } from 'vue';

const theme = ref('light');

function toggleTheme() {
  theme.value = theme.value === 'light' 
    ? 'dark' 
    : 'light';
}

provide('themeContext', {
  theme: readonly(theme),
  toggleTheme
});
`;

const consumerCode = `
// 孙组件中
import { inject } from 'vue';

// 注入 'themeContext'，并提供默认值
const { theme, toggleTheme } = 
  inject('themeContext', {
    theme: ref('default'),
    toggleTheme: () => {}
  });

// 在模板中使用
<p>主题: {{ theme }}</p>
<button @click="toggleTheme">
  切换主题
</button>
`;
</script>

<style scoped>
.provide-inject-view {
  max-width: 900px;
}
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
