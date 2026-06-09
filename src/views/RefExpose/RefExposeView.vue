<!-- src/views/RefExposeView.vue -->
<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>
    <template #demo>
      <!-- 2. 演示区 -->
      <section class="demo-section">
        <h2>Live Demo</h2>
        <div class="parent-component">
          <h3>父组件</h3>
          <p>
            校验结果:
            <span class="result" :class="resultClass">{{
              validationResult
            }}</span>
          </p>
          <button @click="handleValidate">
            点击这里，调用子组件的 validate 方法
          </button>

          <!-- 
          1. 创建一个 ref: const formRef = ref(null)
          2. 将 ref 绑定到子组件上: ref="formRef"
        -->
          <MyForm ref="formRef" />
        </div>
      </section>
    </template>
    <template #code>
      <!-- 3. 代码区 -->
      <section class="code-section">
        <h2>核心代码</h2>
        <div class="code-blocks">
          <div class="code-block">
            <h4>父组件 (RefExposeView.vue)</h4>
            <pre><code>{{ parentCode }}</code></pre>
          </div>
          <div class="code-block">
            <h4>子组件 (MyForm.vue)</h4>
            <pre><code>{{ childCode }}</code></pre>
          </div>
        </div>
      </section>
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MyForm from "@/components/ref-expose-demo/MyForm.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/04-ref 与 defineExpose.md?raw";
// --- Demo Logic ---
// 1. 创建一个 ref 来持有 MyForm 组件的实例
// InstanceType<typeof MyForm> 是获取组件实例类型的 TypeScript 高级用法
const formRef = ref<InstanceType<typeof MyForm> | null>(null);
const validationResult = ref("等待校验...");

// 动态计算结果的 CSS 类
const resultClass = computed(() => {
  if (validationResult.value.includes("成功")) return "success";
  if (validationResult.value.includes("失败")) return "error";
  return "";
});

// 2. 点击按钮时，通过 ref 调用子组件暴露的方法
function handleValidate() {
  if (formRef.value) {
    const isValid = formRef.value.validate(); // 调用子组件的 validate 方法
    validationResult.value = isValid ? "校验成功！" : "校验失败！";
  } else {
    validationResult.value = "获取子组件实例失败";
  }
}

// --- Code Snippets for Display ---
const parentCode = `
// --- 父组件 ---
import { ref } from 'vue';
import MyForm from './MyForm.vue';

// 1. 创建 ref
const formRef = ref(null);

function handleValidate() {
  // 3. 通过 .value 调用子组件方法
  if (formRef.value) {
    formRef.value.validate();
  }
}

// 2. 绑定 ref
<MyForm ref="formRef" />
<button @click="handleValidate">校验</button>
`;

const childCode = `
// --- 子组件 (MyForm.vue) ---
import { ref } from 'vue';

function runValidationLogic() {
  // ... 内部校验逻辑 ...
  return true; // or false
}

// 关键点: 暴露公共 API
defineExpose({
  validate: runValidationLogic
});
`;
</script>

<style scoped>
.ref-expose-view {
  max-width: 900px;
}
section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.parent-component {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
button {
  margin-bottom: 15px;
  padding: 8px 15px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.result {
  font-weight: bold;
}
.success {
  color: #52c41a;
}
.error {
  color: #f5222d;
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
