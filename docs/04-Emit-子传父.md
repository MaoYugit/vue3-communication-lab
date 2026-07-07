# 课时 04：Emit — 子传父

> 核心 API：`defineEmits`、事件触发与监听

---

## 1. 场景引入（5min）

> **生活类比**：学生（子组件）举手提问（触发事件），老师（父组件）听到后回答问题（处理事件）。

**回顾上节课**：上节课学了父传子（Props），那如果子组件想给父组件传消息怎么办？

## 2. 添加路由

```ts
{
  path: '/emit',
  name: 'Emit',
  component: () => import('@/views/02-Emit/EmitView.vue'),
  meta: { title: 'Emit' },
},
```

## 3. 创建子组件（先写接收方）

**创建 `src/components/02-emit-demo/ChildComponent.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const childMessage = ref('')

const emit = defineEmits<{
  (e: 'message-from-child', payload: string): void
}>()

function sendMessage() {
  if (childMessage.value.trim()) {
    emit('message-from-child', childMessage.value)
    childMessage.value = ''
  }
}
</script>

<template>
  <div class="child-box">
    <h4>子组件</h4>
    <input v-model="childMessage" placeholder="输入消息" @keyup.enter="sendMessage" />
    <button @click="sendMessage">发送消息</button>
  </div>
</template>
```

**逐行精讲：**
- `defineEmits<{ (e: '事件名', payload: 类型): void }>()` — 声明要触发的事件
- `emit('事件名', 数据)` — 触发事件并携带数据
- 发送后清空输入框，表示消息已经「发出去了」

## 4. 创建父页面

**创建 `src/views/02-Emit/EmitView.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from '@/components/02-emit-demo/ChildComponent.vue'

const childMessage = ref('')

function handleChildMessage(msg: string) {
  childMessage.value = msg
}
</script>

<template>
  <div class="emit-demo">
    <h3>父组件</h3>
    <p>来自子组件的消息：<strong style="color: #e74c3c">{{ childMessage }}</strong></p>
    <hr />
    <ChildComponent @message-from-child="handleChildMessage" />
  </div>
</template>
```

**关键知识点：**
- `@message-from-child="handleChildMessage"` — 监听子组件触发的事件
- 父组件收到数据后更新自己的状态

## 5. 运行验证

在子组件的输入框中输入文字，点击发送 → 父组件展示收到的消息。

## 6. 对比 Props 和 Emit

| | Props | Emit |
|--|-------|------|
| 方向 | 父 → 子 | 子 → 父 |
| API | `defineProps` | `defineEmits` |
| 传递方 | 父组件模板中绑定 | 子组件代码中调用 `emit()` |
| 接收方 | 子组件声明 props | 父组件 `@事件名` 监听 |

## 7. 进阶讨论：「反向数据流」概念

引出 **"数据向下，事件向上"（Data Down, Events Up）** 原则——Vue 组件通信的核心设计模式。

## 课后思考

1. `defineEmits` 的类型声明有什么用？如果不写类型会怎样？
2. 如果子组件有多个事件要触发（比如 `@confirm`、`@cancel`），应该怎么声明？
