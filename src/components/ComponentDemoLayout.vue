<template>
  <div class="component-demo-layout">
    <!-- 1. Tab 导航栏 -->
    <nav class="tab-nav">
      <a
        :class="{ active: activeTab === 'introduction' }"
        @click="activeTab = 'introduction'"
      >
        知识点介绍
      </a>
      <a :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">
        在线演示
      </a>
      <a :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">
        核心代码
      </a>
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

.tab-nav a {
  padding: 12px 20px;
  cursor: pointer;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;
}

.tab-nav a:hover {
  color: #1890ff;
}

.tab-nav a.active {
  color: #1890ff;
  border-bottom-color: #1890ff; /* 底部边框变成蓝色，形成下划线效果 */
}

/* 内容区域的通用样式，提供一个白色卡片效果 */
.content-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
