# AI Multi-Agent Orchestration Platform — 系统架构

## 1. 平台定位

本平台是一个面向司法/执法领域的 **多智能体 AI 编排平台**，核心能力是将用户请求通过多种工业级编排模式（Router-MoE、ReAct、Plan-and-Solve、Hierarchical）分发给领域专家智能体，并动态挂载技能插件与知识库，实现"意图路由 → 专家研判 → 技能调用 → 知识检索"的全链路闭环。

支持 4 个品牌产品线切换：**睿鉴**（深度审查）、**海盾**（案事件防护）、**智枢**（多智能体协同）、**睿瞳**（数据取证）。

---

## 2. 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (Vue3 + Element Plus)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Dashboard │ │ ArchView │ │ Agents   │ │ Skills   │ │ Chat     │ │
│  │  (总览)   │ │(Vue Flow)│ │  (CRUD)  │ │  (PF4J)  │ │(SSE+MD) │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│         Pinia Stores: agent / skill / knowledge / brand / app      │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP / SSE
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Backend (Spring Boot 3.3.6 + JDK 17)           │
│                                                                     │
│  ┌─────────────────── Orchestration Engine ──────────────────────┐ │
│  │  Router-MoE │ ReAct │ Plan-and-Solve │ Hierarchical           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│              ┌───────────────┼───────────────┐                     │
│              ▼               ▼               ▼                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │  Skill Layer │ │  RAG Layer   │ │  Chat Layer  │               │
│  │  (PF4J Host) │ │ (LangChain4j)│ │ (WebFlux+SSE)│               │
│  │  ┌────────┐  │ │  ┌────────┐  │ │              │               │
│  │  │Plugin  │  │ │  │VectorDB│  │ │              │               │
│  │  │Manager │  │ │  │Factory │  │ │              │               │
│  │  └──┬──┬──┘  │ │  └──┬──┬──┘  │ │              │               │
│  │     │  │     │ │     │  │     │ │              │               │
│  │  ┌──┘  └──┐  │ │  ┌──┘  └──┐  │ │              │               │
│  │  │Voice  OCR│ │ │  │Milvus  ES│ │ │              │               │
│  │  │ES   MySQL│ │ │  │pgvector │ │ │              │               │
│  │  │ChatClean │ │ │  │         │ │ │              │               │
│  │  └─────────┘ │ │  └─────────┘ │ │              │               │
│  └──────────────┘ └──────────────┘ └──────────────┘               │
│                              │                                      │
│  ┌─────────────────── Observability ────────────────────────────┐ │
│  │  Micrometer + Prometheus │ Langfuse │ Audit (Doris)          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│  ┌─────────────────── Infrastructure ───────────────────────────┐ │
│  │  Redis + Redisson │ 达梦 DM (主库) │ Doris (分析库) │ Nacos  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 核心设计原则

| 原则 | 说明 |
| :--- | :--- |
| **编排与技能分离** | 编排层（OrchestrationEngine）只负责意图路由与任务拆解，技能执行由 PF4J 插件独立完成，互不干扰 |
| **插件热插拔** | 技能以 PF4J 插件形式独立打包，支持运行时 load/unload/start/stop，无需重启宿主 |
| **多数据源物理隔离** | 业务数据存达梦（DM），分析数据存 Doris，通过 `@DS` 注解切换，严格隔离 |
| **流式优先** | Chat 层使用 WebFlux + SSE，AI 回复逐字推送，思维链与插件调用元数据实时携带 |
| **全链路可观测** | 编排耗时、Token 消耗、插件加载状态、执行耗时与异常率均通过 Micrometer 暴露 |

---

## 4. 数据流

```
用户输入 → ChatController(SSE) → OrchestrationEngine → GraphExecutor
                                                        │
                                        ┌───────────────┼───────────────┐
                                        ▼               ▼               ▼
                                   SkillRegistry    KnowledgeBase    AgentConfig
                                   (PF4J invoke)    (RAG search)     (路由选择)
                                        │               │               │
                                        ▼               ▼               ▼
                                   SkillExtension   VectorStore      Redis Cache
                                   (插件执行)       (向量检索)       (配置缓存)
                                        │               │               │
                                        └───────────────┼───────────────┘
                                                        ▼
                                              OrchestrationResponse
                                              (content + cotTrace + skillTraces)
                                                        │
                                                        ▼
                                              SSE 逐字推送 → 前端 markdown-it 渲染
```

---

## 5. 模块依赖关系

```
ai-platform-server (启动入口)
  ├── ai-platform-datasource (数据源 + Redis + Redisson)
  │     └── ai-platform-common (通用工具 + 注解 + 枚举)
  ├── ai-platform-agent (编排引擎 + 智能体配置)
  │     ├── ai-platform-common
  │     ├── ai-platform-datasource
  │     └── ai-platform-observability (AgentMetrics)
  ├── ai-platform-rag (知识库 + 向量检索)
  │     ├── ai-platform-common
  │     └── ai-platform-datasource
  ├── ai-platform-skill (技能库 + PF4J Host)
  │     ├── ai-platform-common
  │     ├── ai-platform-plugin-sdk (SkillExtension 接口)
  │     ├── ai-platform-datasource
  │     └── pf4j / pf4j-spring
  ├── ai-platform-chat (对话 + SSE)
  │     ├── ai-platform-agent
  │     └── ai-platform-common
  ├── ai-platform-observability (指标 + 审计 + Langfuse)
  │     ├── ai-platform-common
  │     └── ai-platform-datasource
  └── nacos-client
```