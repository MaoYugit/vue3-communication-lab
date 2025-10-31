### **五、`ref` 与 `defineExpose` —— 父组件的“遥控器”**

想象一下，子组件是一台高级电视机。

- `props` 就像是给电视机插上电源和信号线，为它提供运行所需的基础数据。
- `emit` 就像是电视机上的指示灯或蜂鸣器，当内部发生变化时（比如没信号了），它会主动向外界发出通知。
- `ref` 和 `defineExpose` 则相当于一个**专属遥控器**。父组件可以通过这个遥控器，直接命令电视机执行特定动作，比如“立即开机”、“切换到 HDMI 2”或“执行自检程序”。

#### **1. 核心思想：获取引用，调用方法**

这种模式与 `props/emit` 的数据驱动思想不同，它是**行为驱动**的。父组件不再只是给子组件数据让其自行决定如何渲染，而是直接获取到子组件的一个“句柄”（引用），并通过这个句柄调用子组件**主动暴露**出来的方法或访问其属性。

**为什么是“最后的手段”？** 因为它在某种程度上破坏了组件的封装性。父组件现在需要知道子组件内部有一个叫 `validate` 的方法，这在父子之间建立了更强的耦合关系。如果子组件的作者未来把 `validate` 方法改名为 `runValidation`，那么父组件的代码就会出错。

所以，我们的原则是：**能用 `props/emit` 解决的，就绝不用 `ref`。**只有当确实需要从外部命令式地触发一个内部行为时，才考虑使用它。

#### **2. 学习要点：如何实现**

这是一个两步走的过程：父组件“获取遥控器”，子组件“设计遥控器上的按钮”。

**a. 父组件：通过模板引用 (`ref`) 获取遥控器**

首先，父组件需要一种方式来“抓住”子组件的实例。

- **第一步：创建 ref** 在父组件的 `<script setup>` 中，创建一个值为 `null` 的 `ref`。

  ```typescript
  import { ref, onMounted } from 'vue';
  import ChildComponent from './ChildComponent.vue';
  
  // 创建一个 ref 来持有子组件的实例
  // 类型标注是最佳实践，它能给你完美的类型提示
  const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);
  ```

- **第二步：绑定 ref** 在模板中，将这个 `ref` 绑定到子组件标签上。

  ```vue
  <template>
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>
  </template>
  ```

- **第三步：使用 ref** 当组件挂载后，`childRef.value` 就会指向子组件暴露出的实例。你可以通过它来调用方法。

  ```typescript
  function callChildMethod() {
    // 必须通过 .value 访问
    // 我们还需要检查一下 ref 是否已经成功绑定
    if (childRef.value) {
      childRef.value.publicMethod(); // 调用子组件暴露的方法
    }
  }
  
  // 注意：在 setup 执行期间 childRef.value 还是 null，
  // 因为模板还没渲染。最早能在 onMounted 钩子中访问到它。
  onMounted(() => {
    console.log(childRef.value); 
  });
  ```

**b. 子组件：通过 `defineExpose` 设计遥控器**

在 Vue 3 的 `<script setup>` 中，组件默认是“关闭”的。也就是说，即使父组件拿到了 `ref`，也无法访问子组件内部的任何东西。这是一种安全保护机制。

子组件必须使用 `defineExpose` 宏来明确地“暴露”一个公共接口，决定哪些属性和方法可以被父组件通过 `ref` 访问。

- **子组件 (`ChildComponent.vue`)**

  ```vue
  <template>
    <p>这是一个子组件</p>
    <p>内部秘密值: {{ secret }}</p>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const secret = ref('这是不能被父组件访问的秘密');
  const publicMessage = ref('这是可以被访问的公开消息');
  
  function privateMethod() {
    console.log('这个方法父组件调不到');
  }
  
  function publicMethod() {
    alert('父组件成功调用了我！公开消息是: ' + publicMessage.value);
  }
  
  // 关键点：只有在这里列出的东西，父组件才能通过 ref.value 访问到
  defineExpose({
    publicMessage, // 可以暴露响应式数据
    publicMethod   // 可以暴露方法
  });
  </script>
  ```

  在这个例子中，父组件的 `childRef.value` 将会是一个形如 `{ publicMessage, publicMethod }` 的对象，而无法访问到 `secret` 和 `privateMethod`。

#### **3. 常见面试题解析**

**a. "在 Vue 3 中，父组件如何调用子组件的方法？"**

> **答：** 主要通过模板引用 (`ref`) 和 `defineExpose` API 配合实现，分为两步：
>
> 1. **在子组件中**，使用 `defineExpose` 宏来暴露一个或多个方法。例如 `defineExpose({ myMethod })`。这是必须的，因为 `<script setup>` 默认是关闭的，不暴露任何东西。
> 2. **在父组件中**，首先在 `<script setup>` 里创建一个 `ref`，例如 `const childInstance = ref(null)`。然后在模板中，将这个 `ref` 绑定到子组件标签上：`<ChildComponent ref="childInstance" />`。
> 3. 当组件挂载后，父组件就可以通过 `childInstance.value.myMethod()` 的方式来调用子组件暴露出的方法了。需要注意的是，这个调用必须在组件挂载之后才能进行，比如在一个点击事件处理器或者 `onMounted` 钩子中。

**b. "`defineExpose` 有什么作用？为什么要使用它？"**

> **答：** `defineExpose` 是一个在 `<script setup>` 中使用的宏，它的**唯一作用**就是**定义一个组件向外暴露的公共接口**。
>
> **为什么要使用它，主要基于“封装”和“安全”的考虑：**
>
> 1. **保护内部状态**：在 `<script setup>` 模式下，组件的所有顶级绑定（变量、函数）默认都是私有的，外部无法访问。这是一种很好的封装，可以防止父组件意外地依赖或修改子组件的内部实现细节。
> 2. **明确公共 API**：`defineExpose` 强制我们必须显式地、有意识地选择要暴露给父组件的属性和方法。这相当于为组件定义了一个清晰的、稳定的“公共 API”。所有未在 `defineExpose` 中列出的，都可以被认为是私有的实现细节，子组件可以自由地重构它们而不用担心破坏父组件。
> 3. **提升可维护性**：当其他人阅读你的子组件代码时，看到 `defineExpose` 就能立刻明白这个组件的“合同”是什么，哪些部分是设计用来和外部交互的，这大大提升了代码的可读性和可维护性。
>
> 总结来说，`defineExpose` 不是为了限制我们，而是为了帮助我们构建更健壮、更低耦合、接口更清晰的组件。
