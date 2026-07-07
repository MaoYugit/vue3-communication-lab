# 课时 11：Slot — 插槽分发

> 核心 API：具名插槽、作用域插槽、后备内容

---

## 1. 场景引入（5min）

> **生活类比**：一个相框（子组件）。相框本身只是一个边框，里面放什么照片（内容）由你（父组件）决定。相框可以指定「这个位置放竖版照片（具名插槽）」、「这里放横版照片」、「这里放说明文字」。

**提问**：之前的 Props 是父组件传数据给子组件，由子组件决定如何渲染。那如果父组件想决定子组件内部某一块区域的 HTML 结构呢？

## 2. 添加路由

```ts
{
  path: '/slots',
  name: 'Slots',
  component: () => import('@/views/09-Slot/SlotsView.vue'),
  meta: { title: 'Slots' },
},
```

## 3. 创建带插槽的子组件

**创建 `src/components/09-slots-demo/TodoList.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: '学习 Vue 3 组件通信', completed: true },
  { id: 2, text: '动手实践每个例子', completed: false },
  { id: 3, text: '总结学习笔记', completed: false },
])
</script>

<template>
  <div class="todo-list">
    <div class="todo-header">
      <slot name="header">
        <h2>默认标题</h2>
      </slot>
    </div>

    <ul v-if="todos.length > 0" class="todo-items">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <slot :todo-item="todo">
          <span>{{ todo.text }}</span>
        </slot>
      </li>
    </ul>

    <div v-else class="todo-empty">
      <slot name="empty">
        <p>暂无待办事项</p>
      </slot>
    </div>
  </div>
</template>
```

**重点讲解三种插槽：**

**① 具名插槽 `<slot name="header">`**
- 父组件可以用 `<template #header>` 填充
- `name` 属性标识插槽位置
- 没有 name 的 `<slot>` 默认为 `default`

**② 后备内容（插槽内的默认内容）**
- `<slot name="header"><h2>默认标题</h2></slot>`
- 父组件不提供内容时显示默认值

**③ 作用域插槽 `:todo-item="todo"`**
- 子组件可以将数据「吐回」给父组件
- 父组件通过 `#default="{ todoItem }"` 接收

## 4. 创建父页面

**创建 `src/views/09-Slot/SlotsView.vue`：**

```vue
<script setup lang="ts">
import TodoList from '@/components/09-slots-demo/TodoList.vue'
</script>

<template>
  <div class="slots-demo">
    <h3>使用插槽的父组件</h3>

    <TodoList>
      <template #header>
        <h2>📋 我的待办事项</h2>
        <span class="badge">共 3 项</span>
      </template>

      <template #default="{ todoItem }">
        <input type="checkbox" :checked="todoItem.completed" readonly />
        <span :class="{ completed: todoItem.completed }">
          {{ todoItem.text }}
        </span>
        <span :class="['status', todoItem.completed ? 'done' : 'pending']">
          {{ todoItem.completed ? '✅ 已完成' : '⏳ 进行中' }}
        </span>
      </template>

      <!-- 如果要测试空状态，可取消注释 -->
      <!-- <template #empty>
        <p>🎉 所有任务都完成了！</p>
      </template> -->
    </TodoList>
  </div>
</template>
```

**逐行讲解：**
- `<template #header>` — 填充具名插槽 `header`
- `<template #default="{ todoItem }">` — 填充默认插槽，接收子组件暴露的数据
- 父组件完全控制了子组件内部的渲染结构

## 5. 运行验证

观察 TodoList 中每个待办项的渲染效果——复选框、文字、状态徽章全部由父组件定义。

## 6. 插槽的三种用法总结

| 类型 | 语法 | 作用 |
|------|------|------|
| 默认插槽 | `<slot>` | 最简单的插入点 |
| 具名插槽 | `<slot name="header">` | 多个插入点 |
| 作用域插槽 | `<slot :key="value">` | 子组件向父组件传递数据 |

## 7. 与 Props 的对比

```
Props:   父组件传数据 → 子组件决定如何渲染
Slot:    子组件预留位置 → 父组件决定如何渲染
```

两者是互补关系。

## 课后思考

1. 作用域插槽中的数据流方向是什么？是父→子还是子→父？
2. 如果一个组件既有 prop 又有 slot，什么时候该用 prop，什么时候该用 slot？
