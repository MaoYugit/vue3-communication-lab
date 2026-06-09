# Vue 3 组件通信学习

一个 Vue 3 组件通信方式的学习项目，涵盖 8 种常用通信模式，每个页面包含知识点介绍、在线演示和核心代码展示。

## 技术栈

- **Vue 3** + **TypeScript**
- **Vite** 构建工具
- **Vue Router 4** 路由管理
- **Pinia** 状态管理
- **Mitt** 事件总线
- **markdown-it** Markdown 渲染

## 通信方式一览

| #   | 通信方式           | 适用场景                   |
| --- | ------------------ | -------------------------- |
| 1   | Props & Emit       | 父子组件通信（最常用）     |
| 2   | v-model            | 表单双向绑定               |
| 3   | $attrs             | 父组件透传属性到深层子组件 |
| 4   | ref & defineExpose | 父组件直接调用子组件方法   |
| 5   | Provide & Inject   | 跨层级组件通信             |
| 6   | Pinia              | 全局状态管理               |
| 7   | Mitt               | 非父子组件事件通信         |
| 8   | Slots              | 内容分发与插槽             |

## 项目结构

```
src/
├── components/          # 组件示例
│   ├── attrs-demo/      # $attrs 示例
│   ├── mitt-demo/       # Mitt 事件总线示例
│   ├── pinia-demo/      # Pinia 状态管理示例
│   ├── props-emit-demo/ # Props & Emit 示例
│   ├── provide-inject-demo/ # Provide & Inject 示例
│   ├── ref-expose-demo/ # ref & defineExpose 示例
│   ├── slots-demo/      # Slots 示例
│   ├── v-model-demo/    # v-model 示例
│   ├── ComponentDemoLayout.vue  # 统一布局组件（Tab 切换）
│   └── MarkdownRenderer.vue     # Markdown 渲染组件
├── markdown/            # 各通信方式的 Markdown 文档
├── router/              # 路由配置
├── stores/              # Pinia Store
├── utils/               # 工具函数（Mitt 事件总线）
├── views/               # 各页面视图
├── App.vue              # 主布局（侧边栏导航）
└── main.ts              # 入口文件
```

## 快速开始

### 环境要求

- Node.js >= 18

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

启动后访问终端中显示的地址（默认 `http://localhost:5173`）。

## 每个页面的使用方式

每个通信方式页面提供三个 Tab：

- **知识点介绍** — 通过 Markdown 文档讲解该通信方式的原理和用法
- **在线演示** — 可交互的实时示例，操作后观察组件间的数据变化
- **核心代码** — 展示示例的核心实现代码，方便复制学习

## 添加新的通信方式

1. 在 `src/markdown/` 中添加对应的 Markdown 文档
2. 在 `src/components/` 下创建示例组件目录和组件
3. 在 `src/views/` 中创建页面视图，使用 `ComponentDemoLayout` 组织内容
4. 在 `src/router/index.ts` 中添加路由配置
5. 在 `src/App.vue` 的 `pages` 数组中添加导航项
