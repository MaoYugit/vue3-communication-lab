# 课时 10：Mitt — 事件总线

> 核心 API：`mitt`、`emit` / `on` / `off`、生命周期清理

---

## 1. 场景引入（5min）

> **生活类比**：学校的广播站（Mitt 实例）。任何人（任何组件）都可以在广播站发通知（emit），任何人也可以收听广播（on）。广播站只是一个传话筒，不存储任何信息。

**提问**：上节课用 Pinia 实现了全局状态共享。但如果我们只是想让某个组件触发一个通知（不需要存储状态），用 Pinia 会不会太重？

## 2. 添加路由

```ts
{
  path: '/mitt',
  name: 'Mitt',
  component: () => import('@/views/08-Mitt/MittView.vue'),
  meta: { title: 'Mitt' },
},
```

## 3. 安装 mitt（如果之前没装）

```bash
pnpm add mitt
```

## 4. 创建事件总线实例

**创建 `src/utils/emitter.ts`：**

```ts
import mitt from 'mitt'

type Events = {
  'show-notification': {
    type: 'success' | 'warning' | 'error'
    message: string
  }
}

const emitter = mitt<Events>()

export default emitter
```

**讲解：**
- `mitt<Events>()` — 创建类型安全的事件总线
- `Events` 类型定义了事件名和对应的载荷类型
- 导出为单例（整个应用共用一个实例）

## 5. 创建发送方组件

**创建 `src/components/08-mitt-demo/MittEmitter.vue`：**

```vue
<script setup lang="ts">
import emitter from '@/utils/emitter'

function notify(type: 'success' | 'warning' | 'error', message: string) {
  emitter.emit('show-notification', { type, message })
}
</script>

<template>
  <div class="emitter-box">
    <h4>通知发送方</h4>
    <button class="btn-success" @click="notify('success', '操作成功！')">成功通知</button>
    <button class="btn-warning" @click="notify('warning', '请注意检查')">警告通知</button>
    <button class="btn-error" @click="notify('error', '操作失败！')">错误通知</button>
  </div>
</template>
```

**讲解：**
- `emitter.emit('事件名', 数据)` — 发送事件
- 发送方不需要知道谁会接收，只管发

## 6. 创建接收方组件

**创建 `src/components/08-mitt-demo/MittReceiver.vue`：**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import emitter from '@/utils/emitter'

const notification = ref<{ type: string; message: string } | null>(null)

function showNotification(data: { type: string; message: string }) {
  notification.value = data
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

onMounted(() => {
  emitter.on('show-notification', showNotification)
})

onUnmounted(() => {
  emitter.off('show-notification', showNotification)
})
</script>

<template>
  <div class="receiver-box">
    <h4>通知接收方</h4>
    <div v-if="notification" :class="['notification', `notification-${notification.type}`]">
      {{ notification.message }}
    </div>
    <p v-else style="color: #999">暂无通知</p>
  </div>
</template>
```

**重点讲解：**
- `emitter.on('事件名', 处理函数)` — 注册监听
- `emitter.off('事件名', 处理函数)` — 取消监听
- **必须在 `onUnmounted` 中取消监听**，否则组件卸载后仍会执行回调，造成内存泄漏

## 7. 创建页面

**创建 `src/views/08-Mitt/MittView.vue`：**

```vue
<script setup lang="ts">
import MittEmitter from '@/components/08-mitt-demo/MittEmitter.vue'
import MittReceiver from '@/components/08-mitt-demo/MittReceiver.vue'
</script>

<template>
  <div class="mitt-demo">
    <MittEmitter />
    <hr />
    <MittReceiver />
  </div>
</template>
```

## 8. 运行验证

点击不同通知按钮 → 接收方展示对应颜色的通知，3 秒后自动消失。

## 9. Mitt vs Pinia

| | Mitt | Pinia |
|--|------|-------|
| 本质 | 事件总线（发布/订阅） | 状态管理 |
| 数据持久性 | 不存储数据，触发即过 | 状态持久存储 |
| 使用场景 | 通知、事件触发 | 共享数据 |
| 类型安全 | 需要手动声明 Events 类型 | 天然类型推导 |
| 清理要求 | 必须手动 off | 自动 |
| 组件关系 | 完全解耦 | 通过 store 耦合 |

## 10. 重要警告

**Mitt（或任何事件总线）已不是 Vue 官方推荐的方式。** Vue 3 官方推荐：
- 父子通信：Props + Emit
- 跨层级：provide/inject
- 全局状态：Pinia

Mitt 只在特定场景下有用（如非组件间的通信、第三方集成）。不要过度使用。

## 课后思考

1. 如果 `onMounted` 中注册了事件监听，但忘记在 `onUnmounted` 中取消，会发生什么问题？
2. 如果两个组件都用同一个事件名（比如都用 `show-notification`）但载荷类型不同，会有什么问题？如何避免？
