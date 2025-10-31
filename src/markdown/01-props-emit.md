### **一、`props` —— 组件的“契约”**

想象一下，你正在组装一台电脑。CPU（父组件）需要告诉显卡（子组件）要渲染什么画面。CPU 不会直接伸手去扭动显卡上的开关，而是通过一个标准化的插槽（PCIe 接口）来发送指令和数据。

在 Vue 中，**`props` 就是这个标准化的“插槽”**。它是父组件向子组件传递数据的唯一官方通道，构成了组件间通信的基石。

#### **1. 核心思想：单向数据流 (One-Way Data Flow)**

这是理解 `props` 最重要的概念，也是 Vue 的核心设计理念之一。

*   **什么是单向数据流？**
    数据就像水流，只能从高处（父组件）流向低处（子组件）。子组件可以**使用**这个“水”（数据），但**不能改变水的源头**。

*   **为什么这么设计？**
    为了让应用的状态变得**可预测**和**易于追踪**。想象一下，如果任何子组件都能随意修改来自父组件的数据，那么当应用出现问题时，你将很难定位是哪个组件把数据改错了。这就像一个公司的总部（父组件）下发指令（props），分公司（子组件）只能执行，不能篡改总部的原始指令。如果需要变更，必须向总部汇报。这种清晰的责任划分，使得调试和维护变得极其简单。我们称父组件为数据的**“唯一真理来源” (Single Source of Truth)**。

#### **2. 学习要点：如何使用 `props`**

我们将在 `<script setup>` 语法中学习，这是目前最现代、最简洁的方式。

 **a. 基本用法 (`defineProps`)**

在子组件中，我们使用 `defineProps` 宏来声明它期望从父组件接收哪些 `props`。

* **父组件 (`PropsEmit.vue`)**

  ```vue
  <template>
    <!-- 传递一个静态字符串 -->
    <ChildComponent message="你好，我是静态消息" />
  
    <!-- 使用 v-bind (简写为 :) 传递一个动态的、响应式的数据 -->
    <ChildComponent :message="dynamicMessage" />
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import ChildComponent from '../components/props-emit/Child.vue';
  
  const dynamicMessage = ref('你好，我是一个动态消息');
  </script>
  ```

* **子组件 (`Child.vue`)**
  最简单的方式是使用一个字符串数组来声明 `props`。

  ```vue
  <template>
    <p>{{ message }}</p>
  </template>
  
  <script setup lang="ts">
  // 声明一个名为 'message' 的 prop
  defineProps(['message']);
  </script>
  ```

**b. 类型校验与默认值 (Props Validation)**

在真实开发中，我们几乎**总是**使用对象形式的 `defineProps`，因为它允许我们对传入的数据进行校验。这是一种非常重要的防御性编程，能极大地提高组件的健壮性和可维护性。

* **子组件 (`Child.vue`) - 进阶版**

  ```vue
  <script setup lang="ts">
  defineProps({
    // 类型校验：必须是字符串
    message: {
      type: String,
      required: true // 必填项
    },
    // 类型校验：可以是数字或字符串
    id: [Number, String],
  
    // 默认值：如果父组件没传，则使用这个值
    type: {
      type: String,
      default: 'info' // 基础类型的默认值
    },
  
    // 对象或数组的默认值必须是一个工厂函数
    options: {
      type: Object,
      default: () => ({ enable: true })
    },
  
    // 自定义校验器：更复杂的校验逻辑
    status: {
      validator: function (value: string) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'error'].includes(value)
      }
    }
  });
  </script>
  ```

**3. 响应式数据传递**

Vue 的响应式系统是自动的。当父组件中一个响应式数据（如 `ref` 或 `reactive` 对象）发生改变时，传递给子组件的 `prop` 会自动更新，子组件也会随之重新渲染。

你不需要在子组件做任何特殊处理，只需要确保父组件传递的是响应式数据即可，正如我们在“基本用法”中展示的 `dynamicMessage` 一样。

#### **3. 注意事项：`props` 是只读的！**

这是新手最容易犯的错误。

**严禁**在子组件内部尝试直接修改一个 `prop` 的值。

```typescript
// 在子组件中，这是错误的做法！
const props = defineProps(['message']);

function changeMessage() {
  // 错误！Vue 会在控制台发出警告，并且这不会影响到父组件。
  props.message = '尝试在子组件修改';
}
```

*   **为什么不行？** 因为这直接违反了“单向数据流”原则。
*   **如果非要改怎么办？** 子组件不应该“修改”，而应该“**请求修改**”。它需要通过触发一个事件（我们下一个要学的 `emit`）来通知父组件：“我希望这个值变成 xxx，请你来决定和操作”。

#### **3. 常见面试题解析**

**a. "请解释一下 Vue 的单向数据流原则。"**

> **答：** Vue 的单向数据流是指，所有的数据都拥有一个“唯一真理来源”，通常是父组件。数据通过 `props` 从父组件单向地流向子组件。子组件可以读取和使用这些数据，但绝不能直接修改它们。如果子组件需要变更数据，它必须通过触发事件 (`$emit`) 的方式通知父组件，由父组件来完成状态的变更。这种模式使得应用的数据流向变得清晰、可预测，当出现问题时，能够快速定位到数据源，极大地简化了调试和维护的复杂度。

**b. "为什么不建议在子组件里直接修改 props？如果需要基于 prop 做一些改变，应该怎么处理？"**

> **答：** 不建议直接修改 `props` 主要有两个原因：第一，它破坏了单向数据流原则，会让数据状态变得混乱和不可预测。第二，当父组件更新时，子组件的这次修改也会被覆盖掉。
> 如果确实需要处理，有两种常见的正确做法：
>
> 1.  **将 prop 定义为局部数据**：如果只是想把 `prop` 作为初始值，后续的变化与父组件无关，那么可以在子组件的 `setup` 中用一个本地的 `ref` 来接收它。例如 `const localCount = ref(props.initialCount)`。
> 2.  **定义一个计算属性**：如果需要根据 `prop` 的值计算出另一个值，应该使用 `computed`。例如 `const doubled = computed(() => props.count * 2)`。这样当 `prop` 变化时，计算属性也会自动更新。
> 3.  **（最终方案）触发事件**：如果用户的操作意图是改变这个 `prop` 本身（比如关闭一个弹窗），那么子组件应该 `$emit` 一个事件给父组件，由父组件去修改数据。

**c. "如何在子组件中对 props 进行类型校验？`validator` 函数有什么作用？"**

> **答：** 在子组件的 `defineProps` 中，我们可以传入一个对象而不是数组来进行类型校验。这个对象的键是 `prop` 的名称，值是另一个包含校验规则的对象。
> 常用的校验规则有 `type` (指定类型，如 `String`, `Number` 或 `[String, Number]`)、`required: true` (设为必填)、`default` (提供默认值)。
> 而 `validator` 函数提供了最终的自定义校验能力。它是一个函数，接收 `prop` 的值作为参数，**必须返回一个布尔值**。返回 `true` 表示验证通过，返回 `false` 表示验证失败，Vue 会在控制台打印警告。它通常用在那些 `type` 无法满足的复杂业务逻辑校验上，比如，一个 `status` prop 的值必须是 `'success'`, `'warning'`, `'error'` 中的一个。



---



### **二、`emit` —— 子组件的“扬声器”**

如果说 `props` 是父组件下达的“书面指令”，那么 `emit` 就是子组件用来向父组件喊话的“扬声器”。子组件不能直接改变父组件的状态，但它可以通过这个扬声器大喊：“嘿，我这里发生了一件事（比如用户点击了我），这是相关的信息！”

父组件可以选择听（监听事件），也可以选择不听。如果它听了，它就可以根据收到的消息来决定如何更新自己的状态。

#### **1. 核心思想：事件通知，而非命令**

`emit` 的核心是**通知**，不是**命令**。

*   **什么是事件通知？**
    子组件只是客观地陈述一个事实：“一个名为 `close-dialog` 的事件刚刚发生了。” 它并不关心父组件会如何响应，甚至不关心父组件是否在听。这种低耦合的设计让组件更加独立和可复用。

*   **如何形成通信闭环？**
    1.  **父组件**通过 `props` 将状态传递给**子组件** (例如 `isVisible: true`)。
    2.  **子组件**根据 `props` 渲染自己 (显示弹窗)。
    3.  用户在**子组件**中进行操作 (点击关闭按钮)。
    4.  **子组件** `emit` 一个事件 (例如 `emit('close')`) 来**通知**父组件。
    5.  **父组件**监听到 `close` 事件，并执行一个方法，将自己的状态 `isVisible` 修改为 `false`。
    6.  由于父组件状态改变，Vue 的响应式系统会自动将新的 `props` (`isVisible: false`) 传递给子组件。
    7.  **子组件**接收到新的 `props` 并重新渲染 (隐藏弹窗)。

这个流程完美地遵守了“单向数据流”，同时实现了父子间的双向交互。

#### **2. 学习要点：如何使用 `emit`**

**a. 基本用法 (`defineEmits`)**

与 `defineProps` 类似，我们在子组件中使用 `defineEmits` 宏来声明该组件会触发哪些自定义事件。这不仅是好的代码实践，也让 Vue 能更好地进行性能优化。

* **子组件 (`Child.vue`)**

  ```vue
  <template
    <!-- 当按钮被点击时，调用 handleClick 方法 -->
    <button @click="handleClick">通知父组件</button>
  </template>
  
  <script setup lang="ts">
  // 1. 声明该组件会触发一个名为 'sayHello' 的事件
  const emit = defineEmits(['sayHello']);
  
  function handleClick() {
    // 2. 使用 emit 函数来触发事件
    emit('sayHello');
  }
  </script>
  ```

* **父组件 (`PropsEmit.vue`)**
  父组件使用 `v-on` 指令（简写为 `@`）来监听子组件触发的事件。

  ```vue
  <template>
    <!-- 监听子组件的 sayHello 事件，并调用 showAlert 方法 -->
    <ChildComponent @sayHello="showAlert" />
  </template>
  
  <script setup lang="ts">
  import ChildComponent from '../components/props-emit/Child.vue';
  
  function showAlert() {
    alert('父组件收到了来自子组件的问候！');
  }
  </script>
  ```

**b. 传递参数 (Payload)**

`emit` 最强大的功能之一是可以在触发事件时附带数据。`emit` 函数的第二个及以后的所有参数，都会被作为载荷（payload）传递给父组件的监听函数。

* **子组件 (`Child.vue`)**

  ```vue
  <script setup lang="ts">
  // 声明事件，并可以传递参数
  const emit = defineEmits(['updateUserInfo']);
  
  function updateUser() {
    const name = 'Alice';
    const age = 30;
    // 触发事件，并把 name 和 age 作为参数传递出去
    emit('updateUserInfo', name, age);
  }
  </script>
  ```

* **父组件 (`PropsEmit.vue`)**
  父组件的监听函数会自动接收到这些参数。

  ```vue
  <script setup lang="ts">
  function handleUserUpdate(name: string, age: number) {
    console.log(`收到更新，新用户名为: ${name}, 年龄为: ${age}`);
  }
  </script>
  <template>
    <ChildComponent @updateUserInfo="handleUserUpdate" />
  </template>
  ```

**c.  事件校验**

和 `props` 一样，`emits` 也可以使用对象语法来进行更详细的定义，包括对事件的载荷进行校验。这在开发需要被他人使用的底层组件库时特别有用。

* **子组件 (`Child.vue`)**

  ```vue
  <script setup lang="ts">
  const emit = defineEmits({
    // 没有校验
    click: null,
  
    // 带校验的 submit 事件
    submit: (payload: { email: string, password?: string }) => {
      // 如果 email 存在，则验证通过
      if (payload.email) {
        return true
      } else {
        console.warn('submit 事件缺少 email 载荷！')
        return false
      }
    }
  })
  </script>
  ```

  如果 `emit('submit', ...)` 时传递的载荷不符合校验规则，验证函数返回 `false`，Vue 会在控制台打印一个警告，但事件**依然会被触发**。

#### **3、 常见面试题解析**

**a. "子组件如何与父组件通信？请举例说明。"**

> **答：** 子组件与父组件通信主要通过自定义事件系统。这是一个“通知-监听”模式，遵循单向数据流原则。具体步骤如下：
>
> 1.  **子组件声明事件**：在子组件的 `<script setup>` 中，使用 `defineEmits` 宏来声明它可能触发的事件名称，例如 `const emit = defineEmits(['update-name'])`。
> 2.  **子组件触发事件**：在适当的时候（如用户点击按钮），调用 `emit` 函数来触发事件，并可以附带数据作为载荷。例如 `emit('update-name', 'New Name')`。
> 3.  **父组件监听事件**：在父组件的模板中，使用 `v-on` 指令（简写为 `@`）在子组件的标签上监听这个自定义事件，并绑定一个处理函数。例如 `<ChildComponent @update-name="handleNameUpdate" />`。
> 4.  **父组件响应事件**：在父组件的 `<script setup>` 中定义这个处理函数，它会接收到子组件传递过来的数据，然后父组件可以根据这些数据来更新自己的状态。例如 `function handleNameUpdate(newName) { name.value = newName; }`。
>
> 这样就完成了一次从子到父的通信，形成了一个完整的数据交互闭环。

**b. "在自定义事件中，如何区分原生 DOM 事件的 `$event` 和自定义事件的载荷 `$event`？"**

> **答：** 这是一个非常好的问题，关键在于理解 `$event` 变量的上下文。
>
> 1.  **在原生 DOM 事件中**：当你在模板中监听一个原生事件时，比如 `<button @click="handleClick($event)">`，这里的 `$event` 是一个**原生的事件对象** (Event Object)，比如 `MouseEvent` 或 `KeyboardEvent`。你可以通过它来访问 `event.target`、`event.preventDefault()` 等原生属性和方法。
> 2.  **在自定义组件事件中**：当你在父组件模板中监听一个子组件的自定义事件时，比如 `<ChildComponent @my-event="handleEvent($event)" />`，这里的 `$event` 代表的是**子组件 `emit` 出来的第一个参数（payload）**。如果子组件调用 `emit('my-event', 'data1', 'data2')`，那么在父组件模板里的 `$event` 就等于 `'data1'`。
>
> 总结来说：原生事件的 `$event` 是**事件对象**，而自定义组件事件的 `$event` 是**事件的载荷**。如果自定义事件有多个载荷，在模板中使用 `$event` 只能获取到第一个，要想获取全部载荷，最佳实践是直接绑定一个方法名，如 `@my-event="handleEvent"`，这样 `handleEvent` 函数的所有参数就会依次对应 `emit` 出来的所有载荷。