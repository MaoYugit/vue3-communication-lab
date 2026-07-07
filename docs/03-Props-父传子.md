# 课时 03：Props — 父传子

> 核心 API：`defineProps`、单向数据流

---

## 1. 场景引入（5min）

> **生活类比**：老师（父组件）把考题（数据）发给学生（子组件）。学生只能看考题，不能改考题。如果想改，得告诉老师，由老师来改。

**提问学生**：如果在 Vue 中，一个父组件需要让子组件展示一段文字，怎么办？

## 2. 添加路由

先在 `src/router/index.ts` 的 `routes` 数组中添加：

```ts
{
  path: '/props',
  name: 'Props',
  component: () => import('@/views/01-Props/PropsView.vue'),
  meta: { title: 'Props' },
},
```

让学生观察侧边栏自动出现了新导航项。

## 3. 创建页面（教师写一步，学生跟一步）

**创建 `src/views/01-Props/PropsView.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const parentMessage = ref('这是来自父组件的消息')
</script>

<template>
  <div class="props-demo">
    <h3>父组件</h3>
    <input v-model="parentMessage" placeholder="输入要传递给子组件的消息" />
    <p style="color: #666">父组件消息：{{ parentMessage }}</p>
  </div>
</template>
```

**先让学生看效果** — 只是一个普通的输入框，还没有子组件。

## 4. 创建子组件

**创建 `src/components/01-props-demo/ChildComponent.vue`：**

```vue
<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="child-box">
    <h4>子组件</h4>
    <p>收到的消息：<strong>{{ message }}</strong></p>
  </div>
</template>

<style scoped>
.child-box {
  border: 1px solid #409eff;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  background: #ecf5ff;
}
</style>
```

**逐行精讲：**
- `defineProps<{ message: string }>()` — 声明 props，`<>` 中是 TypeScript 类型
- 子组件不能修改 `message`，只能读取展示

## 5. 在页面中使用子组件

回到 `PropsView.vue`，引入并使用子组件：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from '@/components/01-props-demo/ChildComponent.vue'

const parentMessage = ref('这是来自父组件的消息')
</script>

<template>
  <div class="props-demo">
    <h3>父组件</h3>
    <input v-model="parentMessage" placeholder="输入要传递给子组件的消息" />
    <p style="color: #666">父组件消息：{{ parentMessage }}</p>

    <!-- 关键行：通过 :message 将数据传给子组件 -->
    <ChildComponent :message="parentMessage" />
  </div>
</template>
```

**关键知识点：`v-bind`（缩写 `:`）将父组件的 `parentMessage` 绑定到子组件的 `message` prop。**

## 6. 运行验证

修改输入框内容，观察子组件展示同步变化 → 证明数据从父流向子。

## 7. 提问互动 — 加深理解

**动手试错（这也是教学）：** 让学生尝试在子组件中修改 `message`：

```vue
// 故意写错，让学生看控制台警告
message.value = '试图修改'  // 这样写会报错吗？
```

解释：props 是只读的，如果子组件需要修改数据，应该通知父组件来做（下一课时）。

## 8. 知识点总结

| 概念 | 说明 |
|------|------|
| 方向 | **父 → 子**，单向不可逆 |
| 声明方式 | `defineProps<{ name: Type }>()` |
| 传递方式 | `<Child :prop-name="data" />` |
| 类型约束 | TypeScript 泛型，编译期检查 |
| 只读性 | props 不可被子组件修改 |

## 课后思考

1. props 是单向数据流，为什么 Vue 要设计成单向而不是双向？
2. 如果父组件的数据是对象或数组，子组件修改对象的属性会怎样？（提示：引用类型）
