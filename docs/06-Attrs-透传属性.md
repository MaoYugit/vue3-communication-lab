# 课时 06：$attrs — 透传属性

> 核心 API：`inheritAttrs: false`、`v-bind="$attrs"`、`useAttrs`

---

## 1. 场景引入（5min）

> **生活类比**：你（祖父）给孙子零花钱，但不想经过孩子爸的手（中间组件），直接塞到孙子手里。$attrs 就是这种"跳过中间人"的机制。

**思考**：如果 A 组件传递 5 个 props 给 B 组件，B 只声明了其中 2 个，剩下的 3 个会怎样？

## 2. 添加路由

```ts
{
  path: '/attrs',
  name: '$attrs',
  component: () => import('@/views/04-Attrs/AttrsView.vue'),
  meta: { title: '$attrs' },
},
```

## 3. 创建深层子组件（最内层）

**创建 `src/components/04-attrs-demo/ChildComponent.vue`：**

```vue
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <div class="child-box">
    <h4>深层子组件</h4>
    <p>收到的属性：</p>
    <ul>
      <li v-for="(value, key) in attrs" :key="key">
        <code>{{ key }}: {{ value }}</code>
      </li>
    </ul>
  </div>
</template>
```

## 4. 创建中间组件

**创建 `src/components/04-attrs-demo/ParentComponent.vue`：**

```vue
<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="parent-box">
    <h4>中间组件（ParentComponent）</h4>
    <p>我声明了 <code>title</code> prop，其他的属性通过 <code>$attrs</code> 透传下去</p>
    <ChildComponent v-bind="$attrs" />
  </div>
</template>
```

**重点讲解：**
- `inheritAttrs: false` — 阻止默认的 attribute 继承到当前组件的根元素
- `v-bind="$attrs"` — 手动将未声明的 props 绑定到子组件
- 因为用了 `<script setup>`，`inheritAttrs` 需要在普通 `<script>` 中设置

## 5. 创建祖父组件（页面）

**创建 `src/views/04-Attrs/AttrsView.vue`：**

```vue
<script setup lang="ts">
import ParentComponent from '@/components/04-attrs-demo/ParentComponent.vue'
</script>

<template>
  <div class="attrs-demo">
    <h3>祖父组件（页面）</h3>
    <ParentComponent
      title="这是标题"
      message="这是透传的消息"
      :user-id="123"
      :is-active="true"
    />
  </div>
</template>
```

## 6. 运行验证

观察页面：
- 祖父传了 4 个属性
- 中间组件只声明了 `title`，展示了它
- 其余 3 个透传到深层子组件，被 `useAttrs()` 获取并展示

## 7. 关键概念对比

| | Props 正常传递 | $attrs 透传 |
|--|--------------|------------|
| 中间组件 | 必须声明所有 props | 只需声明自己需要的 |
| 传递方式 | 层层传递 | 跳过中间层 |
| 适用场景 | 已知层级 | 封装高阶组件/UI 库 |

## 课后思考

1. `inheritAttrs: false` 的作用是什么？如果不设置会有什么现象？
2. $attrs 在封装 UI 组件库（比如 el-input 的二次封装）时有什么用途？
