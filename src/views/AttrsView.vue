<!-- src/views/AttrsView.vue -->
<template>
  <div class="attrs-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>3. $attrs</h1>
      <p>
        <code>$attrs</code>
        是一个非常有用的特性，它包含父组件传递的所有属性，但**排除**了子组件通过
        <code>props</code> 声明接收的属性。它常用于属性的“透传”。
      </p>
      <ul>
        <li>
          <strong>核心用法:</strong> 在中间层组件上使用
          <code>v-bind="$attrs"</code>，将属性批量传递给更深层的子组件。
        </li>
        <li>
          <strong>注意:</strong> 在
          <code>&lt;script setup&gt;</code> 中，需要通过
          <code>useAttrs()</code> API 来访问 <code>$attrs</code> 对象。
        </li>
      </ul>
    </section>

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

    <!-- 3. 代码区 -->
    <section class="code-section">
      <h4>核心代码 (ParentComponent.vue)</h4>
      <pre><code>{{ parentCode }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import ParentComponent from "@/components/attrs-demo/ParentComponent.vue";

// --- Code Snippets for Display ---
const parentCode = `
<!-- ParentComponent.vue (中间层) -->
<template>
  <div class="parent-component">
    <h3>父组件</h3>
    <p>我只接收 'title' prop: {{ title }}</p>
    
    <!-- 关键点: 将所有未被 props 接收的属性
         (message, user-id, is-active) 
         继续向下传递给 ChildComponent -->
    <ChildComponent v-bind="$attrs" />
  </div>
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';

// 父组件只声明接收 'title'
defineProps({
  title: String
});

// 推荐禁用默认的属性继承
defineOptions({
  inheritAttrs: false
});
<\/script>
`;
</script>

<style scoped>
.attrs-view {
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
