## **一、`props` —— 组件的“契约”**

想象一下，你正在组装一台电脑。CPU（父组件）需要告诉显卡（子组件）要渲染什么画面。CPU 不会直接伸手去扭动显卡上的开关，而是通过一个标准化的插槽（PCIe 接口）来发送指令和数据。

在 Vue 中，**`props` 就是这个标准化的“插槽”**。它是父组件向子组件传递数据的官方通道，构成了组件间通信的基石。

---

### **1.核心思想：单向数据流 (One-Way Data Flow)**

这是理解 `props` 最重要的概念，也是 Vue 的核心设计理念之一。

- **什么是单向数据流？**
  数据就像水流，只能从高处（父组件）流向低处（子组件）。子组件可以**使用**这个“水”（数据），但**不能改变水的源头**。
- **为什么这么设计？**
  为了让应用的状态变得**可预测**和**易于追踪**。如果任何子组件都能随意修改来自父组件的数据，那么当应用出现问题时，你将很难定位是哪个组件把数据改错了。这就像一个公司的总部（父组件）下发指令（props），分公司（子组件）只能执行，不能篡改总部的原始指令。如果需要变更，必须向总部汇报。这种清晰的责任划分，使得调试和维护变得极其简单。我们称父组件为数据的**“唯一真理来源” (Single Source of Truth)**。

---

### **2.基础教学：在 TypeScript 中声明和使用 Props**

我们将在 `<script setup>` 语法中学习。目前在 Vue 开发中有两种声明 `props` 的主流方式：**运行期声明（JS 风格）** 与 **类型声明（TS 泛型风格）**。

#### **写法 A：经典“运行期”声明（JS 风格）**

这种写法通过传入一个包含类型校验和默认值的配置对象来声明 `props`。

- **父组件 (`PropsEmit.vue`)**

  ```vue
  <template>
    <!-- 传递一个静态字符串 -->
    <ChildComponent message="你好，我是静态消息" />

    <!-- 使用 v-bind (简写为 :) 传递一个动态的、响应式的数据 -->
    <ChildComponent :message="dynamicMessage" />
  </template>

  <script setup lang="ts">
  import { ref } from "vue";
  import ChildComponent from "../components/props-emit/Child.vue";

  const dynamicMessage = ref("你好，我是一个动态消息");
  </script>
  ```

- **子组件 (`Child.vue`) - 配置项校验**

  ```vue
  <template>
    <div>
      <p>消息: {{ message }}</p>
      <p>配置: {{ options.enable ? "已启用" : "已禁用" }}</p>
    </div>
  </template>

  <script setup lang="ts">
  defineProps({
    // 类型校验：必须是字符串，且为必填项
    message: {
      type: String,
      required: true,
    },
    // 基础类型默认值
    type: {
      type: String,
      default: "info",
    },
    // 💡 对象或数组的默认值必须是一个工厂函数（返回一个新对象/新数组）
    // 原因：防止多个子组件实例共享同一个对象引用，造成引用污染
    options: {
      type: Object,
      default: () => ({ enable: true }),
    },
    // 自定义校验器
    status: {
      type: String,
      validator: (value: string) => {
        return ["success", "warning", "error"].includes(value);
      },
    },
  });
  </script>
  ```

---

#### **写法 B：现代“编译期”声明（TS 泛型风格 - 推荐）**

在 TypeScript 环境下，使用 TS 接口（Interface）直接声明属性类型是目前更为主流、类型提示更完美的方案。

- **父组件 (`PropsEmitTs.vue`)**

  ```vue
  <template>
    <ChildTsComponent
      message="来自 TS 的消息"
      :id="123"
      :config="{ theme: 'dark' }"
    />
  </template>

  <script setup lang="ts">
  import ChildTsComponent from "../components/props-emit/ChildTs.vue";
  </script>
  ```

- **子组件 (`ChildTs.vue`)**

  ```vue
  <template>
    <div>
      <p>Message: {{ message }}</p>
      <p>ID: {{ id }}</p>
    </div>
  </template>

  <script setup lang="ts">
  // 1. 定义 TS 接口来约束 Props 契约
  interface Props {
    message: string; // 必填，且必须是 string
    id?: number | string; // 选填，可以是 number 或 string
    config?: { theme: string }; // 选填的对象类型
  }

  // 2. 将接口传入泛型参数中
  defineProps<Props>();
  </script>
  ```

---

### **3.Vue 3.5 黄金法则：响应式 Props 解构**

在以往的版本中，从 `defineProps` 返回的对象是不能直接被解构的（例如 `const { message } = defineProps()` 会导致该属性丢失响应式）。如果需要默认值，往往还要使用复杂的 `withDefaults` 编译器宏。

自 **Vue 3.5** 起，**响应式 Props 解构**已经正式稳定并默认开启。你可以直接利用 JavaScript 原生的解构和默认值语法，不仅代码极致精简，且完美保留响应式。

- **父组件 (`PropsDestructureParent.vue`)**

  ```vue
  <template>
    <div>
      <button @click="count++">增加父组件数值: {{ count }}</button>
      <ChildDestructure :count="count" />
    </div>
  </template>

  <script setup lang="ts">
  import { ref } from "vue";
  import ChildDestructure from "./ChildDestructure.vue";
  const count = ref(0);
  </script>
  ```

- **子组件 (`ChildDestructure.vue`)**

  ```vue
  <template>
    <div>
      <!-- 即使在模板里直接使用 count 和 label，当父组件更新时，它们也是响应式更新的 -->
      <p>数值 (解构后): {{ count }}</p>
      <p>标签 (默认值): {{ label }}</p>
      <p>非基本类型 (默认值): {{ info.author }}</p>
    </div>
  </template>

  <script setup lang="ts">
  interface Props {
    count: number;
    label?: string;
    info?: { author: string };
  }

  // 💡 Vue 3.5 响应式解构写法：
  // 支持原生的解构语法。在赋非基本类型的默认值时，也无需写复杂的工厂函数
  const {
    count,
    label = "默认标签",
    info = { author: "Vue 3.5" },
  } = defineProps<Props>();
  </script>
  ```

---

### **4.注意事项：`props` 是只读的！**

在子组件内部尝试直接修改一个 `prop` 的值是严重违反单向数据流规则的，Vue 会在控制台发出警告。

- **错误示例 (`WrongChild.vue`)**

  ```typescript
  <script setup lang="ts">
  const props = defineProps<{ message: string }>();

  function changeMessage() {
    // ❌ 错误行为！此操作将静默失败或在控制台抛出警告，且绝不会影响到父组件
    props.message = '尝试在子组件修改';
  }
  </script>
  ```

- **如果非要改怎么办？**
  1.  **作为初始值**：如果只是想把传过来的 `prop` 当作初始值，后续变化与父组件无关，可以用一个本地的 `ref` 来接收它：
      ```typescript
      const props = defineProps<{ initialCount: number }>();
      const localCount = ref(props.initialCount); // 本地状态自治
      ```
  2.  **触发事件**：如果改变该属性的真实意图是影响全局或父组件（例如关闭弹窗），则必须通过触发事件（`emit`）通知父组件，由父组件来亲自完成修改。

---

### **5.高阶探讨：可以通过 Props 传递回调函数来实现“子传父”吗？**

在 React 生态中，通过 Props 传递回调函数是子传父的唯一标准方式。但在 Vue 中，这种用法有其独特的优缺点。

#### **1. 代码实现**

- **父组件 (`CallbackParent.vue`)**

  ```vue
  <template>
    <!-- 将 parentCallback 函数作为 prop 传给子组件 -->
    <CallbackChild :on-action="parentCallback" />
  </template>

  <script setup lang="ts">
  const parentCallback = (msg: string) => {
    console.log("父组件收到消息：", msg);
  };
  </script>
  ```

- **子组件 (`CallbackChild.vue`)**

  ```vue
  <template>
    <button @click="handleClick">调用父组件传递的函数</button>
  </template>

  <script setup lang="ts">
  const props = defineProps<{
    onAction: (data: string) => void; // 声明接收一个回调函数
  }>();

  const handleClick = () => {
    props.onAction("来自子组件的问候"); // 直接执行回调
  };
  </script>
  ```

#### **2. 为什么在 Vue 中这通常被视为一种“反模式” (Anti-pattern)？**

虽然上面的代码能正常运行，但在 Vue 开发中，通常更推荐使用官方的 **`emit` 自定义事件**，原因如下：

1.  **违背 Vue 的语义直觉**：在 Vue 的模板设计中，`:` 绑定的是**状态（数据）**，`@` 绑定的是**行为（事件监听）**。如果用 `<Child :onAction="handleClick" />` 会破坏 `@` 监听事件的直觉，增加模板理解成本。
2.  **失去了 DevTools 事件追踪**：使用标准的 `emit` 触发事件，Vue DevTools 能够清晰捕获并记录每一个事件的触发时间、来源和参数。而直接调用 `props` 函数只是一次普通的 JS 函数执行，无法在官方调试工具的 Timeline 中展现，增加了排查问题的难度。

#### **3. 唯一的例外：什么时候传递函数比 `emit` 更好？**

在涉及**异步操作和状态自治**的场景下，传递异步函数（返回 Promise）可以写出非常精妙、高内聚的代码。

- **典型案例：带 Loading 状态的提交按钮**
  子组件按钮在被点击后需要进入 `loading` 状态，等父组件的异步 API 请求处理完后，按钮自动取消 `loading`。如果用 `emit` 需要两端维护多个状态同步；而通过 `prop` 传递返回 Promise 的异步函数，子组件就能完美实现状态自闭环。

- **父组件 (`ButtonParent.vue`)**

  ```vue
  <template>
    <!-- 传递一个返回 Promise 的异步任务 -->
    <SubmitButton :action="saveData" />
  </template>

  <script setup lang="ts">
  const saveData = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("数据保存成功");
        resolve();
      }, 2000); // 模拟2秒的异步请求
    });
  };
  </script>
  ```

- **子组件 (`SubmitButton.vue`)**

  ```vue
  <template>
    <button :disabled="isLoading" @click="handleClick">
      <span v-if="isLoading">保存中...</span>
      <slot v-else>保存数据</slot>
    </button>
  </template>

  <script setup lang="ts">
  import { ref } from "vue";

  const props = defineProps<{
    action: () => Promise<void>; // 必须是返回 Promise 的函数
  }>();

  const isLoading = ref(false);

  const handleClick = async () => {
    isLoading.value = true;
    try {
      await props.action(); // 核心：等待父组件的异步接口执行完毕
    } finally {
      isLoading.value = false; // 无论成功失败，重置 loading 状态
    }
  };
  </script>
  ```

---

### **6.高频面试题解析**

#### **a. "请解释一下 Vue 的单向数据流原则。"**

> **答：** Vue 的单向数据流是指，所有的数据都拥有一个“唯一真理来源”，通常是父组件。数据通过 `props` 从父组件单向地流向子组件。子组件可以读取和使用这些数据，但绝不能直接修改它们。如果子组件需要变更数据，它必须通过触发事件 (`$emit`) 的方式通知父组件，由父组件来完成状态的变更。这种模式使得应用的数据流向变得清晰、可预测，能够快速定位到数据源，极大地简化了调试和维护的复杂度。

#### **b. "在子组件里，如果需要基于传进来的 prop 做一些本地状态改变，应该怎么处理？"**

> **答：** 分两种情况：
>
> 1. 如果该 prop 仅仅是用来作为子组件内部的初始值，后续改变不需要同步回父组件，可以在子组件中使用 `ref` 接收。例如：`const localCount = ref(props.initialCount)`。
> 2. 如果数据变化需要产生新的派生状态，应该使用 `computed` 计算属性。例如：`const formattedName = computed(() => props.name.trim().toUpperCase())`。
> 3. 如果需要修改该 prop 且这个变更需要同步回父组件，应触发事件通知父组件去更新。

#### **c. "Vue 3.5 引入的响应式 Props 解构解决了以前的什么痛点？"**

> **答：**
>
> 1. 在 Vue 3.5 之前，直接通过 ES6 解构（如 `const { title } = defineProps()`）会使得属性丢失响应式，必须通过写 `props.title` 或引入额外的 `toRefs(props)` 才能保持响应，这降低了书写组合式代码的爽快度。
> 2. 之前为泛型声明的 Props 赋默认值需要使用特有的 `withDefaults` 宏，语法相对冗长。
> 3. Vue 3.5 的响应式 Props 解构彻底解决了这一痛点，支持原生解构且自动生成响应式代理，更支持用原生的 JS 默认值语法（如 `{ title = '默认' }`）来极简地声明默认值。

#### **d. "为什么传统的 Props 校验中，对象和数组类型的默认值必须是函数？"**

> **答：** 因为在 JavaScript 中，对象和数组都是引用类型。如果将它们的默认值直接指定为一个对象或数组字面量，那么该组件的所有实例在渲染时，都会共享这同一个引用。一旦某一个组件实例在内部修改了这个默认值的内容，所有其他组件实例渲染出来的默认值也会随之改变，这会造成严重的数据污染。写成工厂函数（例如 `default: () => ({})`）可以确保每个组件实例被创建时，都会通过调用函数获得一个全新的、属于自己的独立对象副本。
> _(注：在 Vue 3.5 响应式解构写法下，由于编译器的优化，写原生默认值对象已不再需要使用工厂函数包裹)_。
