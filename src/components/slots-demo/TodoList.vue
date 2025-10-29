<!-- src/components/slots-demo/TodoList.vue -->
<template>
  <div class="todo-list-card">
    <!-- 1. 具名插槽: header -->
    <header class="card-header">
      <slot name="header">
        <!-- 插槽的默认内容 -->
        <h2>默认标题</h2>
      </slot>
    </header>

    <!-- 2. 作用域插槽: default -->
    <main class="card-body">
      <p v-if="!todos.length" class="empty-state">
        <!-- 3. 具名插槽: empty -->
        <slot name="empty"> 暂无待办事项 </slot>
      </p>
      <ul v-else>
        <li v-for="todo in todos" :key="todo.id">
          <!-- 
            通过在 <slot> 上绑定属性，将 todo 对象暴露给父组件。
            这就是作用域插槽的核心。
          -->
          <slot :todo-item="todo">
            <!-- 作用域插槽的默认内容 -->
            <span>{{ todo.text }}</span>
          </slot>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 子组件负责管理核心数据
const todos = ref<Todo[]>([
  { id: 1, text: "学习 Vue Slots", completed: true },
  { id: 2, text: "完成项目文档", completed: false },
  { id: 3, text: "休息一下", completed: false },
]);
</script>

<style scoped>
.todo-list-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.card-header {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.card-body {
  padding: 15px;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
li:last-child {
  border-bottom: none;
}
.empty-state {
  color: #999;
  text-align: center;
}
</style>
