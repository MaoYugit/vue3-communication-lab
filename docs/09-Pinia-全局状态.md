# 课时 09：Pinia — 全局状态管理

> 核心 API：`defineStore`、`storeToRefs`、getter

---

## 1. 场景引入（5min）

> **生活类比**：学校的公告栏（Pinia Store）。学生会（LoginControls）在上面贴通知（写入状态），学生（LoginStatus）去看公告栏获取信息（读取状态）。公告栏是所有人都能访问的公共区域。

**问题**：回顾之前学的通信方式——Props（父子）、Emit（子父）、provide/inject（祖孙）。如果两个组件完全没有父子关系（兄弟组件、隔多层组件），怎么通信？

## 2. 添加路由

```ts
{
  path: '/pinia',
  name: 'Pinia',
  component: () => import('@/views/07-Pinia/PiniaView.vue'),
  meta: { title: 'Pinia' },
},
```

## 3. 创建 Store

**创建 `src/stores/userStore.ts`：**

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({ name: '', email: '' })

  const welcomeMessage = computed(() => {
    return isLoggedIn.value
      ? `欢迎回来, ${userInfo.value.name}!`
      : '你好, 游客!'
  })

  function login(name: string, email: string) {
    isLoggedIn.value = true
    userInfo.value = { name, email }
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = { name: '', email: '' }
  }

  return { isLoggedIn, userInfo, welcomeMessage, login, logout }
})
```

**逐行精讲（defineStore 的 setup 语法）：**
- `defineStore('user', () => {...})` — 创建 store，`'user'` 是唯一 id
- `ref` → state（状态）
- `computed` → getter（计算属性）
- function → action（操作）
- 返回所有需要暴露的属性和方法

## 4. 创建两个兄弟组件（先写其中一个）

**创建 `src/components/07-pinia-demo/LoginStatus.vue`（读取状态）：**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
</script>

<template>
  <div class="status-box">
    <h4>登录状态（读取）</h4>
    <p><strong>{{ userStore.welcomeMessage }}</strong></p>
    <p v-if="isLoggedIn">邮箱：{{ userInfo.email }}</p>
    <p v-else style="color: #999">请登录后查看信息</p>
  </div>
</template>
```

**讲解 `storeToRefs`：**
- 直接从 store 解构会丢失响应式
- `storeToRefs` 保持响应式解构
- getter（`welcomeMessage`）不需要 storeToRefs，直接用 store 访问

## 5. 创建另一个兄弟组件

**创建 `src/components/07-pinia-demo/LoginControls.vue`（写入状态）：**

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

function handleLogin() {
  userStore.login('Coder Gemini', 'gemini@example.com')
}

function handleLogout() {
  userStore.logout()
}
</script>

<template>
  <div class="controls-box">
    <h4>登录控制（写入）</h4>
    <button :disabled="userStore.isLoggedIn" @click="handleLogin">登录</button>
    <button :disabled="!userStore.isLoggedIn" @click="handleLogout">退出</button>
  </div>
</template>
```

**强调：** 两个组件之间没有直接的 props 或 events 关系，它们通过 store 共享状态。

## 6. 创建页面

**创建 `src/views/07-Pinia/PiniaView.vue`：**

```vue
<script setup lang="ts">
import LoginStatus from '@/components/07-pinia-demo/LoginStatus.vue'
import LoginControls from '@/components/07-pinia-demo/LoginControls.vue'
</script>

<template>
  <div class="pinia-demo">
    <LoginStatus />
    <hr />
    <LoginControls />
  </div>
</template>
```

## 7. 运行验证

点击「登录」→ LoginStatus 同步显示「欢迎回来, Coder Gemini!」
点击「退出」→ LoginStatus 同步显示「你好, 游客!」

两个兄弟组件通过 Pinia 实现了通信。

## 8. 通信模式对比

| 方式 | 关系 | 数据流 |
|------|------|--------|
| Props | 父子 | 单向 |
| Emit | 父子 | 事件 |
| provide/inject | 祖孙 | 跨层级 |
| **Pinia** | **任意组件** | **全局共享** |

## 9. 注意事项

- Pinia 适合"全局"状态（用户信息、主题、语言等）
- 不要把所有状态都放进 Pinia——局部状态用 ref 即可
- `storeToRefs` 只对 state 和 getter 有用，actions 可以直接解构

## 课后思考

1. 什么时候应该用 Pinia，什么时候应该用组件局部 ref？
2. 如果不用 Pinia，还有什么方式可以实现兄弟组件通信？（提示：Mitt、共同的父组件）
