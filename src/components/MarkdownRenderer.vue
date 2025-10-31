<template>
  <!-- 1. v-html 指令用于渲染原始 HTML -->
  <!-- 渲染出的 HTML 会被注入到这个 div 中 -->
  <div class="markdown-body" v-html="renderedMarkdown"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it"; // 引入刚刚安装的库

// 2. 定义 props
// 这个组件会接收一个名为 'source' 的字符串属性，内容就是 Markdown 文本
const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

// 3. 初始化 markdown-it 实例
const md = new MarkdownIt();

// 4. 使用 computed 计算属性来转换 Markdown
// 这样做的好处是，只有当 props.source 发生变化时，才会重新执行渲染，性能更佳
const renderedMarkdown = computed(() => {
  return md.render(props.source);
});
</script>

<style>
/*
  5. 重要：这里的 <style> 标签没有 "scoped" 属性！
  因为 v-html 渲染出来的内容是动态的，Vue 的 scoped 样式无法作用于它们。
  所以我们需要在这里提供一些全局的、针对 .markdown-body class 的样式。
  这些样式会让渲染出的 HTML 看起来更美观。
*/
.markdown-body {
  line-height: 1.7;
  color: #333;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
}

.markdown-body li {
  margin-bottom: 0.5em;
}

.markdown-body code {
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
}

.markdown-body pre {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  background: none;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body blockquote {
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin-left: 0;
}
</style>
