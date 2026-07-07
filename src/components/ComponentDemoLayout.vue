<template>
  <div class="component-demo-layout">
    <!-- 1. Tab 导航栏 -->
    <nav class="tab-nav" role="tablist">
      <button
        :class="{ active: activeTab === 'introduction' }"
        @click="activeTab = 'introduction'"
        role="tab"
        :aria-selected="activeTab === 'introduction'"
      >
        知识点介绍
      </button>
      <button
        :class="{ active: activeTab === 'demo' }"
        @click="activeTab = 'demo'"
        role="tab"
        :aria-selected="activeTab === 'demo'"
      >
        在线演示
      </button>
      <button
        :class="{ active: activeTab === 'code' }"
        @click="activeTab = 'code'"
        role="tab"
        :aria-selected="activeTab === 'code'"
      >
        核心代码
      </button>
    </nav>

    <!-- 2. 内容展示区 -->
    <div class="tab-content">
      <div v-if="activeTab === 'introduction'" class="content-section">
        <slot name="introduction"></slot>
      </div>

      <div v-if="activeTab === 'demo'" class="content-section">
        <slot name="demo"></slot>
      </div>

      <div v-if="activeTab === 'code'" class="content-section">
        <slot name="code"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 3. 核心逻辑：追踪当前激活的 Tab
const activeTab = ref("introduction");
</script>

<style scoped>
.component-demo-layout {
  max-width: 900px;
  margin: 0 auto;
}

/* Tab 导航的样式 */
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 25px;
}

.tab-nav button {
  padding: 12px 20px;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  border: none;
  background: none;
  font-size: inherit;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;
}

.tab-nav button:hover {
  color: #1890ff;
}

.tab-nav button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

/* 内容区域的通用样式，提供一个白色卡片效果 */
.content-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
