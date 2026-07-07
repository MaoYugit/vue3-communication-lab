<!-- src/views/SlotsView.vue -->
<template>
  <ComponentDemoLayout>
    <template #introduction>
      <MarkdownRenderer :source="introductionContent" />
    </template>
    <template #demo>
      <!-- 2. 演示区 -->
      <section class="demo-section">
        <h2>Live Demo</h2>
        <p>下面是一个完全通过插槽自定义的 TodoList 组件：</p>

        <TodoList>
          <!-- 使用 #header 具名插槽自定义标题 -->
          <template #header>
            <div class="custom-header">
              <h3>🚀 我的待办事项</h3>
              <span>共 3 项</span>
            </div>
          </template>

          <!-- 
          使用 #default 作用域插槽自定义列表项的渲染。
          通过解构 { todoItem } 获取子组件暴露的数据。
        -->
          <template #default="{ todoItem }">
            <div
              class="custom-todo-item"
              :class="{ completed: todoItem.completed }"
            >
              <input type="checkbox" :checked="todoItem.completed" disabled />
              <span>{{ todoItem.text }}</span>
              <span v-if="todoItem.completed" class="status-badge">已完成</span>
              <span v-else class="status-badge pending">待办</span>
            </div>
          </template>

          <!-- (可选) 演示 #empty 插槽 -->
          <!-- <template #empty>
          <p>🎉 所有任务都已完成！</p>
        </template> -->
        </TodoList>
      </section>
    </template>
    <template #code>
      <!-- 3. 代码区 -->
      <section class="code-section">
        <h4>核心代码 (父组件如何使用插槽)</h4>
        <pre><code>{{ parentCode }}</code></pre>
      </section>
    </template>
  </ComponentDemoLayout>
</template>

<script setup lang="ts">
import TodoList from "@/components/09-slots-demo/TodoList.vue";
import ComponentDemoLayout from "@/components/ComponentDemoLayout.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import introductionContent from "@/markdown/08-slot.md?raw";
import parentCode from "@/views/09-Slot/SlotsView.vue?raw";
</script>

<style scoped>
section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 自定义样式 */
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-header h3 {
  margin: 0;
}

.custom-todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.custom-todo-item.completed span {
  text-decoration: line-through;
  color: #999;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
}
.status-badge {
  background-color: #52c41a;
}
.status-badge.pending {
  background-color: #faad14;
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
