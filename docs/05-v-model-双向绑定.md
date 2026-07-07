# 课时 05：v-model — 双向绑定

> 核心 API：`modelValue`、`update:modelValue`、多 v-model

---

## 1. 场景引入（5min）

> **生活类比**：一个白板（子组件），老师（父组件）可以在上面写字，学生也可以在上面写。两边写的内容都会同步显示。

实际上 v-model 是 **Props + Emit 的语法糖**。

## 2. 添加路由

```ts
{
  path: '/v-model',
  name: 'v-model',
  component: () => import('@/views/03-V-model/VModelView.vue'),
  meta: { title: 'v-model' },
},
```

## 3. 先讲概念 — v-model 的本质

**在黑板上写下：**

```vue
<!-- 这是语法糖 -->
<Child v-model="data" />

<!-- 等价于 -->
<Child :modelValue="data" @update:modelValue="data = $event" />
```

> `v-model` = `:modelValue` + `@update:modelValue`

## 4. 创建自定义输入组件

**创建 `src/components/03-v-model-demo/CustomInput.vue`：**

```vue
<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    class="custom-input"
    placeholder="输入文字..."
    @input="onInput"
  />
</template>
```

**逐行讲解：**
- `modelValue` prop — 接收父组件传过来的值
- `update:modelValue` emit — 值变化时通知父组件
- `:value="modelValue"` + `@input="onInput"` — 代替 `v-model`，因为不能用 v-model 实现 v-model

## 5. 创建父页面使用

**创建 `src/views/03-V-model/VModelView.vue`：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from '@/components/03-v-model-demo/CustomInput.vue'

const searchText = ref('')
</script>

<template>
  <div class="v-model-demo">
    <h3>默认 v-model</h3>
    <CustomInput v-model="searchText" />
    <p>当前输入：{{ searchText }}</p>
  </div>
</template>
```

## 6. 运行验证

输入文字 → 下方实时显示 → 证明双向绑定成功

## 7. 进阶：多个 v-model

**提问**：如果子组件需要绑定多个数据（比如 firstName 和 lastName）怎么办？

Vue 3 支持多个 v-model：

```vue
<UserInfoEditor v-model:firstName="first" v-model:lastName="last" />
```

创建 `src/components/03-v-model-demo/UserInfoEditor.vue`：

```vue
<script setup lang="ts">
defineProps<{
  firstName: string
  lastName: string
}>()

const emit = defineEmits<{
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
}>()
</script>

<template>
  <div class="editor">
    <label>
      名：
      <input :value="firstName" @input="emit('update:firstName', ($event.target as HTMLInputElement).value)" />
    </label>
    <label>
      姓：
      <input :value="lastName" @input="emit('update:lastName', ($event.target as HTMLInputElement).value)" />
    </label>
  </div>
</template>
```

父组件增加：

```vue
const firstName = ref('张')
const lastName = ref('三')

<p>完整姓名：{{ firstName }}{{ lastName }}</p>
<UserInfoEditor v-model:firstName="firstName" v-model:lastName="lastName" />
```

## 8. v-model 演进回顾（如果是旧版 Vue 用户）

| Vue 2 | Vue 3 |
|-------|-------|
| `v-model` + `.sync` | 统一为 `v-model` |
| `value` + `input` | `modelValue` + `update:modelValue` |
| 单个 v-model | 多个 v-model |

## 课后思考

1. 如果给一个组件同时用 `v-model` 和 `:modelValue`，会冲突吗？
2. 自定义组件里的 `<input>` 用 `:value` + `@input` 而不是 `v-model`，为什么？
