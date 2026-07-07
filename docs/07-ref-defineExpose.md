# 课时 07：ref + defineExpose — 父调用子方法

> 核心 API：模板 ref、`defineExpose`、`InstanceType`

---

## 1. 场景引入（5min）

> **生活类比**：遥控器（父组件）控制空调（子组件）。按下遥控器的按钮，空调执行对应操作（开关、调温）。这就是父组件主动调用子组件的方法。

**上节课回顾**：Props 是父传数据、Emit 是子发通知。那如果父组件想主动让子组件做某件事呢？

## 2. 添加路由

```ts
{
  path: '/ref-expose',
  name: 'ref & defineExpose',
  component: () => import('@/views/05-RefExpose/RefExposeView.vue'),
  meta: { title: 'ref & defineExpose' },
},
```

## 3. 创建子组件

**创建 `src/components/05-ref-expose-demo/MyForm.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('')

function runValidationLogic(): boolean {
  if (!username.value.trim()) {
    error.value = '用户名不能为空'
    return false
  }
  if (!password.value.trim()) {
    error.value = '密码不能为空'
    return false
  }
  if (password.value.length < 6) {
    error.value = '密码长度不能少于6位'
    return false
  }
  error.value = ''
  return true
}

defineExpose({
  validate: runValidationLogic,
})
</script>

<template>
  <div class="form-box">
    <h4>登录表单（子组件）</h4>
    <div>
      <label>用户名：<input v-model="username" placeholder="请输入用户名" /></label>
    </div>
    <div>
      <label>密码：<input v-model="password" type="password" placeholder="请输入密码" /></label>
    </div>
    <p v-if="error" style="color: #e74c3c">{{ error }}</p>
  </div>
</template>
```

**核心讲解：**
- `defineExpose({ validate: runValidationLogic })` — 显式暴露方法给父组件
- 默认情况下 `<script setup>` 中的内容**对外不可见**
- `runValidationLogic` 是内部函数，通过 `defineExpose` 选择性地暴露

## 4. 创建父页面

**创建 `src/views/05-RefExpose/RefExposeView.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import MyForm from '@/components/05-ref-expose-demo/MyForm.vue'

const formRef = ref<InstanceType<typeof MyForm> | null>(null)
const resultMsg = ref('')

function callValidate() {
  const isValid = formRef.value?.validate()
  if (isValid) {
    resultMsg.value = '✅ 验证通过！'
  } else {
    resultMsg.value = '❌ 验证失败，请检查表单'
  }
}
</script>

<template>
  <div class="ref-expose-demo">
    <h3>父组件</h3>
    <MyForm ref="formRef" />
    <button @click="callValidate">调用子组件的 validate 方法</button>
    <p v-if="resultMsg" :class="{ success: resultMsg.includes('✅') }">
      {{ resultMsg }}
    </p>
  </div>
</template>
```

**重点讲解：**
- `ref<InstanceType<typeof MyForm> | null>(null)` — 类型安全的模板 ref
- `formRef.value?.validate()` — 调用子组件暴露的方法
- `<MyForm ref="formRef">` — 模板 ref 绑定

## 5. 运行验证

- 不输入内容，点击按钮 → 显示错误
- 输入内容后，点击按钮 → 验证通过

## 6. 与 Props + Emit 的对比

| 方式 | 触发方 | 本质 |
|------|--------|------|
| Props | 父 → 子传数据 | 数据驱动 |
| Emit | 子 → 父发通知 | 事件驱动 |
| ref + expose | 父 → 子调方法 | 命令式调用 |

**强调：** 命令式调用（ref + expose）应该谨慎使用，优先选择声明式的 Props/Emit。适用于：表单验证、焦点管理、DOM 操作等场景。

## 课后思考

1. 为什么 `<script setup>` 默认不暴露任何内容？这样设计的好处是什么？
2. 用 ref 调用子组件方法和用 emit 让子组件自己执行，有什么区别？各自更适合什么场景？
