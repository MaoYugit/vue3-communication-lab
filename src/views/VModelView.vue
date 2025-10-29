<template>
  <div class="v-model-view">
    <!-- 1. 介绍区 -->
    <section class="intro-section">
      <h1>2. v-model</h1>
      <p>
        <code>v-model</code> 是 <code>props</code> 和
        <code>emit</code> 的一个语法糖，用于轻松实现父子组件之间的双向数据绑定。
      </p>
      <ul>
        <li>
          <strong>默认 v-model:</strong> 相当于传递 <code>modelValue</code> prop
          并监听 <code>update:modelValue</code> 事件。
        </li>
        <li>
          <strong>多个 v-model (Vue 3):</strong> 可以通过参数实现，例如
          <code>v-model:title</code> 相当于传递 <code>title</code> prop 并监听
          <code>update:title</code> 事件。
        </li>
      </ul>
    </section>

    <!-- 2. 演示区 -->
    <section class="demo-section">
      <h2>Live Demo</h2>

      <!-- 默认 v-model 示例 -->
      <div class="demo-block">
        <h3>默认 v-model</h3>
        <p>
          你在下面输入框输入的内容将实时同步到这里:
          <span class="value">{{ searchText }}</span>
        </p>
        <CustomInput v-model="searchText" />
      </div>

      <!-- 多个 v-model 示例 -->
      <div class="demo-block">
        <h3>多个 v-model</h3>
        <p>
          用户信息:
          <span class="value">{{ user.firstName }} {{ user.lastName }}</span>
        </p>
        <UserInfoEditor
          v-model:firstName="user.firstName"
          v-model:lastName="user.lastName"
        />
      </div>
    </section>

    <!-- 3. 代码区 -->
    <section class="code-section">
      <h2>核心代码</h2>
      <div class="code-blocks">
        <div class="code-block">
          <h4>父组件 (VModelView.vue)</h4>
          <pre><code>{{ parentCode }}</code></pre>
        </div>
        <div class="code-block">
          <h4>子组件 (CustomInput.vue)</h4>
          <pre><code>{{ childCode }}</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import CustomInput from "@/components/v-model-demo/CustomInput.vue";
import UserInfoEditor from "@/components/v-model-demo/UserInfoEditor.vue";

// --- Demo Logic ---
const searchText = ref("Hello v-model");
const user = reactive({
  firstName: "John",
  lastName: "Doe",
});

// --- Code Snippets for Display ---
const parentCode = `
// --- 父组件 ---
import { ref } from 'vue';
import CustomInput from './CustomInput.vue';

const searchText = ref('');

// 使用 v-model
<CustomInput v-model="searchText" />

// 等价于:
<CustomInput 
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
`;

const childCode = `
// --- 子组件 (CustomInput.vue) ---
<template>
  <input 
    :value="modelValue" 
    @input="emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
<\/script>
`;
</script>

<style scoped>
.v-model-view {
  max-width: 900px;
}
section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.demo-block {
  margin-bottom: 30px;
}
.value {
  color: #1890ff;
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
