# 课时 08：provide / inject — 跨层级依赖注入

> 核心 API：`provide`、`inject`、`InjectionKey`、`readonly`

---

## 1. 场景引入（5min）

> **生活类比**：公司 CEO（顶层组件）宣布「今年全员涨薪」。这个消息不需要经过部门经理（中间组件），直接传达到每个员工（深层组件）。即使部门经理离职，也不影响这个消息的传达。

**问题**：如果 A 组件有一个数据，D 组件也需要，B 和 C 是中间组件但不关心这个数据。用 props 一层层传很麻烦，怎么办？

## 2. 添加路由

```ts
{
  path: '/provide-inject',
  name: 'Provide & Inject',
  component: () => import('@/views/06-ProvideInject/ProvideInjectView.vue'),
  meta: { title: 'Provide & Inject' },
},
```

## 3. 创建类型定义（可选但推荐 Ts）

**创建 `src/components/06-provide-inject-demo/themeContext.ts`：**

```ts
import type { InjectionKey, DeepReadonly, Ref } from 'vue'

export interface ThemeContext {
  theme: DeepReadonly<Ref<string>>
  toggleTheme: () => void
}

export const themeContextKey: InjectionKey<ThemeContext> = Symbol('themeContext')
```

**讲解：**
- `InjectionKey<ThemeContext>` — 类型安全的注入键
- `DeepReadonly<Ref<string>>` — 防止子组件直接修改注入的值
- `Symbol('themeContext')` — 保证 key 的唯一性

## 4. 创建中间组件

**创建 `src/components/06-provide-inject-demo/MiddleComponent.vue`：**

```vue
<script setup lang="ts">
import DeepChild from './DeepChild.vue'
</script>

<template>
  <div class="middle-box">
    <h4>中间组件</h4>
    <p>我只是透传，不接触 theme 数据</p>
    <DeepChild />
  </div>
</template>
```

**强调：** 中间组件**不需要**做任何事情，这就是 provide/inject 的优势。

## 5. 创建深层子组件

**创建 `src/components/06-provide-inject-demo/DeepChild.vue`：**

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { themeContextKey } from './themeContext'

const { theme, toggleTheme } = inject(themeContextKey, {
  theme: 'light' as any,
  toggleTheme: () => {},
})
</script>

<template>
  <div :class="['deep-box', `theme-${theme}`]">
    <h4>深层子组件</h4>
    <p>当前主题：<strong>{{ theme }}</strong></p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>
```

**讲解：**
- `inject(key, defaultValue)` — 从祖先注入数据
- 第二个参数提供默认值，防止祖先没有 provide 时报错

## 6. 创建父页面（提供者）

**创建 `src/views/06-ProvideInject/ProvideInjectView.vue`：**

```vue
<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { themeContextKey } from '@/components/06-provide-inject-demo/themeContext'
import MiddleComponent from '@/components/06-provide-inject-demo/MiddleComponent.vue'

const theme = ref('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide(themeContextKey, {
  theme: readonly(theme) as any,
  toggleTheme,
})
</script>

<template>
  <div :class="['provider-box', `theme-${theme}`]">
    <h3>提供者（顶层组件）</h3>
    <p>当前主题：{{ theme }}</p>

    <MiddleComponent />
  </div>
</template>
```

**核心讲解：**
- `provide(key, value)` — 提供数据，所有后代可注入
- `readonly(theme)` — 包装为只读，防止子组件直接修改

## 7. 运行验证

点击「切换主题」按钮 → 深层子组件和顶层容器同时切换主题色

## 8. provide/inject 的数据流图

```
ProvideInjectView (提供 theme + toggleTheme)
       │
       ▼
MiddleComponent (不接触数据，直接透传)
       │
       ▼
DeepChild (inject 获取 theme + toggleTheme)
```

## 9. 关键对比

| | Props 逐层传递 | provide/inject |
|--|---------------|----------------|
| 中间组件 | 必须声明并传递 props | 完全不需要关心 |
| 层级数量 | N 层需要 N 次传递 | 一次 provide，任意层 inject |
| 数据流向 | 明确可追踪 | 隐式（来源不直观） |
| 适用场景 | 少量层级 | 深层嵌套、跨层级 |

## 10. 注意事项

- provide/inject 使数据流变得隐式，不利于追踪 → **不要滥用**
- 搭配 `readonly` 防止子组件直接修改数据
- 通过 provide 传递函数（如 `toggleTheme`）可以实现子→父的间接通信

## 课后思考

1. provide/inject 使得数据来源不直观，有什么办法可以改善这种情况？
2. 如果多个祖先 provide 了同一个 key，inject 会获取到哪一个？（提示：就近原则）
