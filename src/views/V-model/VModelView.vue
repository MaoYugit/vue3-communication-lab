<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>

    <template #demo>
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
    </template>

    <template #code>
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
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import CustomInput from "@/components/v-model-demo/CustomInput.vue";
import UserInfoEditor from "@/components/v-model-demo/UserInfoEditor.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/02-v-model.md?raw";

const searchText = ref("Hello v-model");
const user = reactive({
  firstName: "John",
  lastName: "Doe",
});

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
