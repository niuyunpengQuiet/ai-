# 前端模块详解

## 目录结构

```
src/
├── main.ts                    # Vue createApp + Pinia + Element Plus 注册
├── App.vue                    # 主布局（侧边栏 + 视图切换）
├── index.css                  # 全局样式 + Element Plus 变量覆盖
├── constants.ts               # 静态数据（AGENTS/SKILLS/KNOWLEDGE_BASES/NAVIGATION/BRANDINGS）
├── lib/utils.ts               # 工具函数
├── stores/
│   ├── agent.ts               # useAgentStore / useSkillStore / useKnowledgeStore
│   ├── brand.ts               # useBrandStore（品牌切换）
│   └── app.ts                 # useAppStore（导航视图切换）
└── components/
    ├── DashboardView.vue      # 系统总览
    ├── ArchitectureView.vue   # 架构拓扑（Vue Flow DAG）
    ├── AgentsView.vue         # 智能体配置 CRUD
    ├── SkillsView.vue         # 插拔式技能库
    ├── KnowledgeView.vue      # 知识库治理
    ├── ChatView.vue           # 交互调试工作台
    └── flow/                  # Vue Flow 自定义组件
        ├── OrchestratorNode.vue
        ├── WorkerNode.vue
        ├── RouterNode.vue
        ├── SupervisorNode.vue
        ├── PlannerNode.vue
        ├── ExecutorNode.vue
        ├── ToolNode.vue
        ├── UserNode.vue
        └── CustomEdge.vue
```

---

## Pinia 状态管理

### useAgentStore

| 字段/方法 | 类型 | 说明 |
| :--- | :--- | :--- |
| `agents` | `ref<any[]>` | 智能体列表，初始化自 AGENTS 常量 |
| `workers` | `computed` | 过滤 role=Worker |
| `routers` | `computed` | 过滤 role=Router |
| `supervisors` | `computed` | 过滤 role=Supervisor |
| `addAgent(agent)` | method | 添加智能体 |
| `updateAgent(id, data)` | method | 更新智能体 |
| `removeAgent(id)` | method | 删除智能体 |

### useSkillStore

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `skills` | `ref<any[]>` | 技能列表，初始化自 SKILLS 常量 |

### useKnowledgeStore

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `knowledgeBases` | `ref<any[]>` | 知识库列表，初始化自 KNOWLEDGE_BASES 常量 |

### useBrandStore

| 字段/方法 | 类型 | 说明 |
| :--- | :--- | :--- |
| `activeBrand` | `ref` | 当前品牌对象 |
| `showBrandMenu` | `ref<boolean>` | 下拉菜单开关 |
| `setBrand(brand)` | method | 切换品牌 |
| `brands` | 常量 | BRANDINGS 数组 |

### useAppStore

| 字段/方法 | 类型 | 说明 |
| :--- | :--- | :--- |
| `activeView` | `ref<string>` | 当前视图 ID |
| `setActiveView(view)` | method | 切换视图 |

---

## 6 大视图

### DashboardView（系统总览）

- 4 张统计卡片：活跃智能体 / 插拔式技能 / 知识库总切片 / 编排调度 QPS
- 柱状图：分层路由请求量（7 天）
- 审计时间线：el-timeline 展示最近编排事件

### ArchitectureView（架构拓扑）

- 左侧 4 种编排模式选择器
- 右侧 Vue Flow 画布，每种模式对应不同的 DAG 节点布局
- 8 种自定义节点类型：Orchestrator / Worker / Router / Supervisor / Planner / Executor / Tool / User
- 自定义边标签（CustomEdge）显示路由/委派/分配关系
- 支持 Background 网格、Controls 缩放、MiniMap 导航

### AgentsView（智能体配置）

- el-table 展示智能体列表（基本信息 / 模型驱动 / 编排策略 / 挂载依赖）
- el-dialog 编辑表单（名称 / 角色 / 模型 / 温度 / 最大步数 / 技能池 / 知识库 / 降级策略）
- ElMessageBox.confirm 删除确认

### SkillsView（插拔式技能库）

- 2 列网格展示技能卡片
- 每张卡片：图标 + 名称 + ID + 状态徽章 + 接入类型 / 提供方 / 鉴权方式

### KnowledgeView（知识库治理）

- 2 列网格展示知识库卡片（Embedding 引擎 / 向量后端 / 文档切片数）
- el-drawer 可视化编辑器
  - 左侧模板选择：QA 问答对 / Markdown 规范文档 / 三元组知识图谱
  - 右侧编辑区：知识集名称 / 向量模型 / 向量后端 / 分块策略 + 模板录入表单
- 编排指南说明区域

### ChatView（交互调试工作台）

- 左侧对话区
  - 消息列表（用户/智能体气泡）
  - 思维链折叠面板（el-collapse + el-steps）
  - Markdown 渲染（markdown-it + highlight.js 代码高亮）
  - 流式逐字输出动画
  - 输入框 + 发送按钮
- 右侧设置面板
  - 智能体多选（el-checkbox-group）+ 权重滑块（el-slider）
  - 交互模式切换（同步/流式）
  - 编排模式选择（el-select）

---

## 全局样式体系

| CSS 类 | 用途 |
| :--- | :--- |
| `.view-card` | 通用卡片容器（白底 + 圆角 12px + 阴影） |
| `.view-title` | 视图标题（24px / 700） |
| `.view-subtitle` | 视图副标题（14px / 灰色） |
| `.stat-card` | 统计卡片（hover 上浮效果） |
| `.status-badge` | 状态徽章（active/warning/syncing/error） |
| `.type-tag` | 类型标签（等宽字体） |
| `.grid-pattern` | 网格背景纹理 |
| `.typing-indicator` | 打字动画指示器 |

Element Plus CSS 变量覆盖（`index.css` :root）：
- 主色调 → `#4f46e5`（Indigo）
- 圆角 → `8px`
- 字体 → Inter + JetBrains Mono