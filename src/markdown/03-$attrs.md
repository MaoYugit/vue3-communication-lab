### **四、`$attrs` —— 组件属性的“透传快递员”**

`$attrs` ，透传属性。想象一个场景：你（父组件）想送一个包裹（一些属性）给你的孙子（深层子组件）。但这个包裹必须经过你的儿子（中间层组件）转交。

正常情况下，你儿子需要先接收包裹（声明 `props`），打开看看，然后再重新打包，传递给他的儿子。这非常麻烦，特别是当包裹里的东西很多时。

`$attrs` 就是一个聪明的“快递员”。你儿子拿到包裹后，甚至不用拆开看，直接对快递员说：“这个包裹 (`$attrs`) 你直接完整地 (`v-bind`) 送给我的儿子就行了。”

#### **1. 核心思想：未被“认领”的属性集合**

`$attrs` 的核心很简单：它是一个对象，包含了父组件传递给当前组件的**所有属性**，但**排除了**那些已经被当前组件通过 `defineProps` 声明接收的属性。

换句话说： **`$attrs` = 父组件传入的所有属性 - 子组件已声明的 `props`**

此外，`$attrs` 还会包含父组件传递的所有事件监听器（比如 `@click`），这在 Vue 2 中是由 `$listeners` 负责的，Vue 3 将它们合并了。

#### **2. 学习要点：如何使用 `$attrs`**

**a. 基本用法：`useAttrs()` 和 `v-bind`**

在 `<script setup>` 语法中，我们不能直接访问 `$attrs`，需要通过 `useAttrs` 这个组合式 API 来获取它。

最常见的用法是在模板中直接使用 `v-bind="$attrs"`，将所有未被声明的属性一股脑儿地绑定到一个特定的子元素上。

- **封装一个完美的 `MyButton.vue` 组件** 我们希望这个按钮组件既能接收我们自定义的 `prop`（比如 `type="primary"`），又能接收原生 `<button>` 的所有属性（比如 `disabled`, `class`, `id`, `aria-label` 等）。

  ```vue
  <!-- MyButton.vue (子组件) -->
  <template>
    <!-- 
      1. class 的绑定做了特殊处理，既保留了我们自己的 'my-button' 类，
         也合并了父组件通过 class 属性传进来的类。
      2. v-bind="$attrs" 是关键！它会把 disabled, id, aria-label 等
         所有未在 props 中声明的属性全部应用到这个 button 元素上。
    -->
    <button 
      class="my-button" 
      :class="`my-button--${type}`"
      v-bind="$attrs"
    >
      <slot></slot> <!-- 允许父组件传入按钮文字 -->
    </button>
  </template>
  
  <script setup lang="ts">
  // 这个组件只“认领”一个名为 type 的 prop
  defineProps({
    type: {
      type: String,
      default: 'default'
    }
  });
  </script>
  ```

  - **父组件中使用**

  ```vue
  <template>
    <!-- 
      'type' 会被 MyButton 的 props 接收。
      'class', 'disabled', '@click' 没有在 MyButton 的 props 中声明，
      所以它们会进入 $attrs，并通过 v-bind="$attrs" 最终应用到
      MyButton 内部的 <button> 元素上。
    -->
    <MyButton 
      type="primary" 
      class="extra-style" 
      disabled 
      @click="handleClick"
    >
      点击我
    </MyButton>
  </template>
  ```

**b. 进阶：`inheritAttrs: false` 和多层透传**

默认情况下，如果一个组件没有根元素，或者 `v-bind="$attrs"` 没有被使用，那么 `$attrs` 里的属性会自动“坠落”并应用到组件的**根元素**上。这有时不是我们想要的行为。

比如，我们想把属性应用到根元素下的**第二个**子元素上。这时就可以通过 `inheritAttrs: false` 来禁用这个默认行为。

- **场景：封装一个带 `label` 的输入框 `MyInput.vue`** 我们希望 `placeholder`, `maxlength` 等属性应用到 `<input>` 上，而不是外层的 `<div>` 上。

  ```vue
  <!-- MyInput.vue -->
  <template>
    <div class="my-input-wrapper">
      <label>{{ label }}</label>
      <!-- 我们希望属性透传到这里 -->
      <input v-bind="$attrs"> 
    </div>
  </template>
  
  <script setup lang="ts">
  // 禁用默认的属性继承行为
  defineOptions({
    inheritAttrs: false
  });
  
  // 只声明自己关心的 prop
  defineProps(['label']);
  </script>
  ```

- **多层透传（祖 → 父 → 孙）** 这个特性让深层组件封装变得异常简单。

  ```vue
  <!-- GrandParent.vue -->
  <template>
    <ParentComponent 
      placeholder="请输入..." 
      maxlength="10" 
      data-id="123" 
    />
  </template>
  
  <!-- ParentComponent.vue (中间层) -->
  <template>
    <div>
      <!-- 直接把所有未认领的属性继续向下传递 -->
      <ChildComponent v-bind="$attrs" />
    </div>
  </template>
  
  <!-- ChildComponent.vue (最终目标) -->
  <template>
    <!-- 所有来自 GrandParent 的属性最终在这里生效 -->
    <input v-bind="$attrs">
  </template>
  ```

  在这个例子中，`ParentComponent` 完全不关心 `placeholder` 等属性是什么，它只是一个纯粹的“快递中转站”。

#### **3. 常见面试题解析**

**a. "`$attrs` 和 `props` 有什么区别？"**

> **答：** 它们之间最核心的区别在于**“是否被子组件声明”**。
>
> 1. **`props`**：是子组件通过 `defineProps` **明确声明**希望接收的属性。子组件内部可以直接访问这些属性，并且它们是响应式的。`props` 是组件公开的、稳定的 API。
> 2. **`$attrs`**：是一个包含了父组件传递的、但**没有被**子组件 `props` 声明的所有属性和事件监听器的对象。它就像一个“收纳筐”，用来收集所有未被认领的属性。
>
> 总结来说，`props` 是组件的“正式接口”，而 `$attrs` 是“透传通道”，主要用来方便地将属性传递给深层子组件或内部的某个特定元素，增强了组件的封装性和灵活性。

**b. "请举一个你在真实项目中会使用 `$attrs` 的场景。"**

> **答：** 最经典的场景就是封装基础 UI 组件，比如一个自定义的按钮 `ElButton` 或输入框 `ElInput`。
>
> 拿封装一个 `MyButton` 组件举例。我希望这个组件除了有我自己定义的功能（比如 `type="primary"` 或 `size="large"`，这些我会用 `props` 声明），还要能让使用者像使用原生 `<button>` 元素一样自由。使用者可能想给它添加 `id`, `class`, `style`，或者绑定 `disabled` 状态，甚至监听原生的 `@mouseover` 事件。
>
> 如果我把所有这些原生属性都在 `props` 里声明一遍，那 `props` 列表会变得无比冗长和难以维护。
>
> 最好的做法是，我只在 `props` 里声明 `MyButton` 特有的属性（`type`, `size`）。然后在 `MyButton` 的模板内部，找到真正的 `<button>` 元素，在它上面添加 `v-bind="$attrs"`。
>
> 这样一来，所有父组件传递过来的、未被 `props` 认领的属性（`id`, `class`, `disabled`, `@mouseover` 等）就会被 `$attrs` 收集，并自动应用到原生的 `<button>` 元素上。这让我的 `MyButton` 组件既有自定义功能，又具备了原生元素的全部灵活性，封装得非常完美和高内聚。
