## **二、`emit` —— 子组件的“扬声器”**

如果说 `props` 是父组件下达的“书面指令”，那么 `emit` 就是子组件用来向父组件喊话的“扬声器”。子组件不能直接改变父组件的状态，但它可以通过这个扬声器大喊：“我这里发生了一件事（比如用户点击了我），这是相关的信息！”

父组件可以选择听（监听事件），也可以选择不听。如果它听了，它就可以根据收到的消息来决定如何更新自己的状态。

---

### **1. 核心思想：事件通知，而非命令**

`emit` 的核心是**通知**，不是**命令**。

- **什么是事件通知？**
  子组件只是客观地陈述一个事实：“一个名为 `close-dialog` 的事件刚刚发生了。”它并不关心父组件会如何响应，甚至不关心父组件是否在听。这种低耦合的设计让组件更加独立和可复用。
- **如何形成通信闭环？**
  1.  **父组件**通过 `props` 将状态传递给**子组件**（例如 `isVisible: true`）。
  2.  **子组件**根据 `props` 渲染自己（显示弹窗）。
  3.  用户在**子组件**中进行操作（点击关闭按钮）。
  4.  **子组件**调用 `emit` 触发一个事件（例如 `emit('close')`）来**通知**父组件。
  5.  **父组件**监听到 `close` 事件，并执行一个方法，将自己的状态 `isVisible` 修改为 `false`。
  6.  由于父组件状态改变，Vue 的响应式系统会自动将新的 `props`（`isVisible: false`）传递给子组件。
  7.  **子组件**接收到新的 `props` 并重新渲染（隐藏弹窗）。

这个流程既遵守了“单向数据流”，同时实现了父子间的双向交互闭环。

---

### **2. 基础教学：在 TypeScript 中声明和触发 Emit**

在 `<script setup>` 语法中，我们使用 `defineEmits` 宏来声明该组件会触发哪些自定义事件。

#### **写法 A：经典“运行期”声明（JS 风格）**

通过传入一个字符串数组来声明事件名称。这种方式直观，但缺乏编译期的参数类型约束。

- **子组件 (`Child.vue`)**

  ```vue
  <template>
    <!-- 当按钮被点击时，触发自定义事件 -->
    <button @click="handleClick">通知父组件</button>
  </template>

  <script setup lang="ts">
  // 1. 声明该组件会触发一个名为 'sayHello' 的事件
  const emit = defineEmits(["sayHello"]);

  function handleClick() {
    // 2. 使用 emit 函数来触发事件
    emit("sayHello");
  }
  </script>
  ```

- **父组件 (`PropsEmit.vue`)**

  ```vue
  <template>
    <!-- 监听子组件的 sayHello 事件，并调用 showAlert 方法 -->
    <ChildComponent @sayHello="showAlert" />
  </template>

  <script setup lang="ts">
  import ChildComponent from "./Child.vue";

  function showAlert() {
    alert("父组件收到了来自子组件的问候！");
  }
  </script>
  ```

---

#### **写法 B：现代“编译期”类型声明（TS 泛型风格 - 推荐）**

在 TypeScript 环境中，使用类型声明可以明确约束事件名称以及传递的参数类型。

- **子组件 (`ChildTs.vue`)**

  ```vue
  <template>
    <button @click="handleClick">通知父组件（带 TS 约束）</button>
  </template>

  <script setup lang="ts">
  // 💡 Vue 3.3+ 推荐的极简泛型声明方式：
  // 键表示事件名，值是一个元组，元组里的元素定义了该事件所需的参数类型与名称
  const emit = defineEmits<{
    sayHello: []; // 无参数事件
    changeStatus: [status: "active" | "inactive"]; // 约束参数只能是特定的字符串
  }>();

  function handleClick() {
    // 触发事件时，IDE 会给出精准的类型提示，传错参数或类型不符会在编译期直接报错
    emit("changeStatus", "active");
  }
  </script>
  ```

- **父组件 (`PropsEmitTs.vue`)**

  ```vue
  <template>
    <!-- 监听自定义事件，并绑定处理函数 -->
    <ChildTsComponent @change-status="handleStatusChange" />
  </template>

  <script setup lang="ts">
  import ChildTsComponent from "./ChildTs.vue";

  function handleStatusChange(status: "active" | "inactive") {
    console.log(`当前子组件状态更新为: ${status}`);
  }
  </script>
  ```

---

### **3. 进阶：传递参数 (Payload) 与事件校验**

#### **a. 传递多个参数（多载荷）**

`emit` 支持传递任意数量的参数。

- **子组件 (`ChildPayload.vue`)**

  ```vue
  <template>
    <button @click="updateUser">更新用户信息</button>
  </template>

  <script setup lang="ts">
  const emit = defineEmits<{
    updateUserInfo: [name: string, age: number, isVip: boolean];
  }>();

  function updateUser() {
    // 触发事件，并依次传入三个参数
    emit("updateUserInfo", "Alice", 30, true);
  }
  </script>
  ```

- **父组件 (`ParentPayload.vue`)**

  ```vue
  <template>
    <ChildPayloadComponent @update-user-info="handleUserUpdate" />
  </template>

  <script setup lang="ts">
  import ChildPayloadComponent from "./ChildPayload.vue";

  // 参数会依次对应子组件 emit 出来的载荷
  function handleUserUpdate(name: string, age: number, isVip: boolean) {
    console.log(`收到更新 -> 用户名: ${name}, 年龄: ${age}, 是否VIP: ${isVip}`);
  }
  </script>
  ```

---

#### **b. 运行期事件验证（Event Validation）**

在编写高复用的组件（如组件库）时，如果未使用 TS 编译期校验，可以使用**运行期对象语法**来对 emit 附带的载荷进行逻辑校验。

- **子组件 (`ChildValidation.vue`)**

  ```script
  <script setup lang="ts">
  const emit = defineEmits({
    // 无校验的普通事件
    click: null,

    // 带校验的 submit 事件：传入一个验证函数
    submit: (payload: { email: string, password?: string }) => {
      // 如果 email 存在且格式包含 '@'，则验证通过
      if (payload.email && payload.email.includes('@')) {
        return true; // 返回 true 表示通过校验
      } else {
        console.warn('⚠️ submit 事件触发失败：email 格式不正确或缺失！');
        return false; // 返回 false 表示校验失败，控制台会打印警告
      }
    }
  });

  function handleFormSubmit() {
    // 故意传递一个不合法的 email 来测试验证器
    emit('submit', { email: 'invalid-email' });
  }
  </script>
  ```

  \*注：当校验器返回 `false` 时，控制台会输出黄色警告以辅助开发者排查，但该事件**依然会被正常触发和传递\***。

---

### **4. 规范：事件命名格式 (Naming Convention)**

在 Vue 中，自定义事件的触发和监听推荐遵循以下命名规范：

1.  **触发端（JS/TS 中）**：推荐使用驼峰命名法（`camelCase`），例如 `emit('updateUserInfo')`。
2.  **监听端（HTML 模板中）**：由于 HTML 标签属性不区分大小写，推荐转换为短横线命名法（`kebab-case`）来绑定监听，例如 `@update-user-info`。
3.  **自动映射**：Vue 内部会自动处理 `camelCase` 到 `kebab-case` 的映射转换，因此这两种命名格式可以无缝衔接。

---

### **5. 高频面试题解析**

#### **a. "在自定义事件中，如何区分原生 DOM 事件的 `$event` 和自定义事件的载荷 `$event`？"**

> **答：** 这两者的区别在于其绑定的上下文环境：
>
> 1. **在原生 DOM 事件中**：例如 `<button @click="handleClick($event)">`，此时的 `$event` 是**原生事件对象 (Event Object)**，如 `MouseEvent` 或 `KeyboardEvent`。我们可以通过它访问 `event.target`、`event.preventDefault()` 等方法。
> 2. **在自定义组件事件中**：例如 `<Child @my-event="handleEvent($event)" />`，此时的 `$event` 代表的是**子组件 `emit` 传递出来的第一个参数（payload）**。如果子组件调用 `emit('my-event', 'data1', 'data2')`，那么在模板里的 `$event` 就只等于第一个参数 `'data1'`。
>    _为了能够完整获取所有传递的参数，最佳实践是避免在模板中使用内联语句，而是直接绑定方法名称，如 `@my-event="handleEvent"`，这样绑定的函数就会按顺序接收到 `emit` 的所有载荷参数。_

#### **b. "Vue 3 中如何像 Vue 2 那样使用全局事件总线（Event Bus）？"**

> **答：** 在 Vue 3 中，官方已经彻底移除了实例上的 `$on`、`$off` 和 `$once` 方法（即无法再使用 `new Vue()` 来充当事件总线）。
>
> 1. 如果需要跨越多个层级或无关组件进行单纯的事件广播，推荐使用轻量级第三方库 **`mitt`** 或 **`tiny-emitter`** 作为全局事件总线。
> 2. 但在更符合现代化 Vue 3 体系的开发中，首选方案通常是利用 **Pinia 进行全局状态管理**，或者使用 **响应式 Composable 共享状态**，因为这些方案提供了更好的状态响应性和可维护性，比纯粹的发布订阅总线（Event Bus）更易于追踪和调试。

#### **c. "Vue 3.3 针对 defineEmits 引入了什么新语法？它解决了什么问题？"**

> **答：** 在 Vue 3.3 之前，泛型形式的 `defineEmits` 需要编写相对复杂的调用签名类型，比如：
> `const emit = defineEmits<{ (e: 'change', id: number): void }>()`
> 这种写法的语法较为冗长和繁琐。
> Vue 3.3 引入了简化的**元组类型声明语法**：
> `const emit = defineEmits<{ change: [id: number] }>()`
> 这种新语法极大缩减了代码量，使其更加符合日常的阅读与编写直觉，同时也让事件参数的类型定义变得更为简单清晰。
