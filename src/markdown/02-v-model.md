### **三、`v-model` —— 双向绑定的“快捷指令”**

在我们刚刚学习的 `Props & Emit` 模式中，我们实现了一个完整的通信闭环：

1.  父组件通过 **prop** (`:message`) 将数据传给子组件。
2.  子组件通过 **emit** (`@message-from-child`) 将新数据传回给父组件。
3.  父组件的监听函数再去更新自己的数据。

这个模式非常通用，但也有些繁琐。对于像表单输入框这类需要“双向绑定”的场景，Vue 提供了一个专门的语法糖来简化这个过程，它就是 `v-model`。

#### **1. 核心思想：一个指令，两份工作**

`v-model` 的本质不是新功能，而是 `props` 和 `emit` 的一个**快捷方式**。当你在一个自定义组件上使用 `v-model` 时，Vue 会自动帮你完成两件事：

1.  传递一个名为 `modelValue` 的 `prop`。
2.  监听一个名为 `update:modelValue` 的自定义事件。

也就是说，下面这两行代码是**完全等价**的：

```vue
<!-- 使用 v-model 的简洁写法 -->
<CustomInput v-model="searchText" />

<!-- v-model 的完整形态（本质）-->
<CustomInput 
  :modelValue="searchText" 
  @update:modelValue="newValue => searchText = newValue" 
/>
```

*`@update:modelValue="searchText = $event"` 是一种更简洁的写法，`$event` 在这里就是子组件 emit 出来的载荷。*

理解了这个“等价关系”，你就掌握了 `v-model` 的核心秘密。

#### **2. 学习要点：如何实现一个支持 `v-model` 的组件**

既然 `v-model` 是父组件和子组件之间的一个“契约”，那么子组件就必须按照契约的规定来办事。

**1. 实现默认的 `v-model`**

要让你的自定义组件支持 `v-model`，你需要在子组件内部：

1.  **接收** `modelValue` 这个 `prop`。
2.  **声明** `update:modelValue` 这个 `emit`。
3.  在需要更新数据时，`emit` 出 `update:modelValue` 事件，并带上新的值。

* **子组件 (`CustomInput.vue`) 的实现**

  ```vue
  <template>
    <!-- 
      1. 将接收到的 modelValue prop 绑定到原生 input 的 value 属性上。
      2. 监听原生 input 的 input 事件。当用户输入时，会触发这个事件。
    -->
    <input 
      :value="modelValue" 
      @input="handleInput"
    />
  </template>
  
  <script setup lang="ts">
  // 步骤 1: 接收名为 'modelValue' 的 prop
  defineProps(['modelValue']);
  
  // 步骤 2: 声明会触发名为 'update:modelValue' 的事件
  const emit = defineEmits(['update:modelValue']);
  
  // 步骤 3: 在原生 input 事件的处理函数中，触发我们的自定义事件
  function handleInput(event: Event) {
    // event.target 是触发事件的 DOM 元素（就是那个 input）
    // (event.target as HTMLInputElement).value 获取 input 的当前值
    // 我们把这个新值通过 emit 发送给父组件
    emit('update:modelValue', (event.target as HTMLInputElement).value);
  }
  </script>
  ```

**2. 进阶：在一个组件上实现多个 `v-model`**

Vue 3 的一个强大之处在于，你可以在一个组件上绑定多个 `v-model`，只要给它们起不同的名字即可。这是通过给 `v-model` 添加“参数”来实现的。

* **`v-model` 的参数化**
  `v-model` 的契约会根据参数名动态改变：

  *   `v-model:title="pageTitle"` 等价于 `:title="pageTitle" @update:title="pageTitle = $event"`。
  *   `v-model:content="pageContent"` 等价于 `:content="pageContent" @update:content="pageContent = $event"`。

* **父组件 (`VModelView.vue`)**

  ```vue
  <template>
    <UserInfoEditor 
      v-model:firstName="user.firstName" 
      v-model:lastName="user.lastName" 
    />
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  const user = reactive({ firstName: 'John', lastName: 'Doe' });
  </script>
  ```

* **子组件 (`UserInfoEditor.vue`)**
  子组件只需要按照新的契约，接收对应名称的 `props` 并声明对应名称的 `emits` 即可。

  ```vue
  <template>
    <input :value="firstName" @input="emit('update:firstName', $event.target.value)">
    <input :value="lastName" @input="emit('update:lastName', $event.target.value)">
  </template>
  
  <script setup lang="ts">
  // 接收 'firstName' 和 'lastName' 两个 prop
  defineProps(['firstName', 'lastName']);
  
  // 声明 'update:firstName' 和 'update:lastName' 两个事件
  const emit = defineEmits(['update:firstName', 'update:lastName']);
  </script>
  ```

#### **3. 常见面试题解析**

**a. "请解释一下在自定义组件上使用 `v-model` 的原理。"**

> **答：** 在自定义组件上使用 `v-model` 本质上是一个语法糖，它简化了 `props` 和 `emit` 的组合使用。默认情况下，`<CustomComponent v-model="data" />` 这行代码等同于 `<CustomComponent :modelValue="data" @update:modelValue="data = $event" />`。
> 所以，它的原理就是：
>
> 1.  **父组件**向子组件传递一个名为 `modelValue` 的 `prop`。
> 2.  **父组件**同时监听子组件触发的一个名为 `update:modelValue` 的自定义事件，并在事件触发时更新自己的数据。
> 3.  **子组件**则必须接收 `modelValue` 这个 `prop` 来显示数据，并在内部数据需要改变时，`emit` 出 `update:modelValue` 事件，将新值作为载荷传递出去。

**b. "如何在 Vue 3 的一个组件上实现多个 `v-model`？"**

> **答：** Vue 3 支持通过给 `v-model` 指令添加参数来实现多个双向绑定。语法是 `v-model:argumentName="data"`。
> 例如，`v-model:title="pageTitle"` 会被 Vue 解析为：
>
> *   传递一个名为 `title` 的 `prop`。
> *   监听一个名为 `update:title` 的自定义事件。
>
> 要实现这个功能，子组件中也需要做相应的配合：
>
> 1.  使用 `defineProps` 接收所有 `v-model` 参数名对应的 `prop`，例如 `defineProps(['title', 'content'])`。
> 2.  使用 `defineEmits` 声明所有对应的 `update` 事件，例如 `defineEmits(['update:title', 'update:content'])`。
> 3.  在组件内部，当需要更新某个值时，`emit` 出对应的事件，例如 `emit('update:title', newTitle)`。
>     这种方式在封装复杂的、需要管理多个状态的组件（如表单、弹窗）时非常有用。

