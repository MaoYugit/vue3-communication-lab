### **九、`slots` —— 组件的“内容定制卡槽”**

想象一下你买了一个模块化的书架（子组件）。

*   书架的**框架、材质和基本结构**是固定的，由制造商（子组件的作者）决定。
*   但是，书架上**具体放什么书、摆什么装饰品**（内容），完全由你（父组件的使用者）来决定。

`slots` 就是书架上那些**预留出来的、让你自由发挥的空间**。子组件定义了布局和框架，但把内部一块或多块区域的“渲染权”**让渡**给了父组件。

#### **一、 核心思想：内容分发 (Content Distribution)**

`slots` 的核心是**灵活性**和**复用性**。它允许你创建一个高度可复用的“外壳”组件，而将易变的部分——**内容**——的控制权交给使用者。

与 `props` 传递配置信息不同，`slots` 传递的是实际的 HTML 结构 (`<template>`)。

#### **二、 学习要点：插槽的三种形态**

**1. 默认插槽 (Default Slot)**

这是最简单的形式，就像一个只有一个大空间的集装箱。子组件里只有一个匿名的 `<slot>` 标签作为占位符。

* **子组件 (`BaseCard.vue`)**
  它提供了一个带样式的卡片外壳。

  ```vue
  <template>
    <div class="card">
      <!-- 父组件传递的所有内容都会被插入到这里 -->
      <slot></slot>
    </div>
  </template>
  <style scoped>
  .card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; }
  </style>
  ```

* **父组件 (`SlotsView.vue`)**

  ```vue
  <template>
    <BaseCard>
      <!-- 这里面的所有 HTML 都会被发送到 BaseCard 的 <slot> 中 -->
      <h2>文章标题</h2>
      <p>这是一段文章内容...</p>
      <button>阅读更多</button>
    </BaseCard>
  </template>
  ```

**2. 具名插槽 (Named Slots)**

这就像一个有多个分隔间（比如头部、主体、脚部）的便当盒。子组件定义了多个**带有 `name` 属性**的 `<slot>`，父组件可以使用 `v-slot` 指令（可简写为 `#`）将内容精确地放入对应的插槽。

* **子组件 (`PageLayout.vue`)**

  ```vue
  <template>
    <div class="page-layout">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <!-- 也可以有一个默认插槽和具名插槽共存 -->
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </template>
  ```

* **父组件 (`SlotsView.vue`)**

  ```vue
  <template>
    <PageLayout>
      <!-- 使用 v-slot:header 或 #header 将内容放入名为 'header' 的插槽 -->
      <template #header>
        <h1>我的网站标题</h1>
      </template>
  
      <!-- 没有名字的内容会进入默认插槽 -->
      <p>这里是主内容区域...</p>
  
      <!-- 使用 #footer 将内容放入名为 'footer' 的插槽 -->
      <template #footer>
        <p>&copy; 2025 我的网站</p>
      </template>
    </PageLayout>
  </template>
  ```

**3. 作用域插槽 (Scoped Slots)**

这是最强大、也是最关键的一种插槽。它**颠倒了数据的流动方向**，让**子组件可以向父组件的插槽内容中传递数据**。

**核心场景**：子组件负责管理和循环数据，但它不知道每一项数据**应该如何被渲染**。渲染的决定权交还给父组件。

* **子组件 (`ItemList.vue`)**
  它有一个 `items` 数组，它会遍历这个数组，但把每一项的渲染工作都交给父组件。

  ```vue
  <template>
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        <!-- 
          关键点：通过在 <slot> 标签上绑定属性，
          将 item 和 index 数据“暴露”给父组件的插槽。
         -->
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
  </template>
  <script setup lang="ts">
  const items = ref([ { id: 1, text: '任务A' }, { id: 2, text: '任务B' } ]);
  </script>
  ```

* **父组件 (`SlotsView.vue`)**

  ```vue
  <template>
    <ItemList>
      <!-- 
        1. 使用 v-slot="slotProps" 来接收子组件暴露的所有数据 (一个对象)。
        2. 更常用的方式是使用解构，直接获取需要的数据: v-slot="{ item, index }"
       -->
      <template #default="{ item, index }">
        <!-- 
          现在，我们可以在父组件的作用域内，访问到子组件的 item 数据，
          并完全自定义它的渲染方式。
        -->
        <strong>{{ index + 1 }}.</strong> 
        <span :style="{ color: item.text === '任务A' ? 'blue' : 'green' }">
          {{ item.text }}
        </span>
      </template>
    </ItemList>
  </template>
  ```

  **一句话总结作用域插槽：子组件提供“数据”(what)，父组件提供“模板”(how)。**

#### **三、 常见面试题解析**

**"请解释一下默认插槽、具名插槽和作用域插槽的区别和各自的应用场景。"**

> **答：** 当然。这三者是 Vue 插槽系统的核心，它们的区别在于灵活性和功能：
>
> 1.  **默认插槽 (Default Slot)**：
>     *   **区别**：它是匿名的，一个组件里通常只有一个。子组件使用 `<slot></slot>` 来定义占位符。
>     *   **应用场景**：用于封装简单的、内容结构单一的容器类组件。比如一个 `Card` 组件，它只提供一个卡片外壳，里面的所有内容都由父组件一次性填充。
>
> 2.  **具名插槽 (Named Slots)**：
>     *   **区别**：它是有名字的。子组件通过 `<slot name="xxx"></slot>` 定义多个占位符。父组件使用 `<template #xxx>` 将内容精确地插入到对应名称的插槽中。
>     *   **应用场景**：用于封装复杂的、多区域布局的组件。最典型的例子就是 `PageLayout` 组件，它有 `header`, `footer`, `sidebar` 等多个独立的区域需要父组件来填充。
>
> 3.  **作用域插槽 (Scoped Slots)**：
>     *   **区别**：这是最强大的插槽，它的核心区别在于**数据的流向**。它允许**子组件向父组件的插槽模板中传递数据**。子组件在 `<slot>` 上绑定属性来暴露数据，父组件通过 `v-slot="props"` 或 `v-slot="{ data }"` 来接收并使用这些数据。
>     *   **应用场景**：用于创建高度可复用的“渲染器”组件。子组件负责提供和管理数据，但把每一项数据的渲染逻辑完全交给父组件。最经典的场景是封装一个 `DataTable` 或 `ListView` 组件，表格的数据和分页逻辑在子组件内部，但每一行、每一列具体如何展示（比如添加按钮、格式化数据、改变颜色等）则由父组件通过作用域插槽来完全自定义。
