# 后端模块详解

## 模块总览

| 模块 | artifactId | 核心职责 |
| :--- | :--- | :--- |
| Common | ai-platform-common | 统一响应体、异常处理、枚举、注解（分布式锁/限流）、Redis 工具 |
| Plugin SDK | ai-platform-plugin-sdk | PF4J ExtensionPoint 接口定义，宿主与插件共享的 SkillExtension/SkillContext/SkillResult |
| Datasource | ai-platform-datasource | 多数据源配置（DM + Doris）、Redis/Redisson 配置 |
| Agent | ai-platform-agent | 智能体配置 CRUD、编排引擎、4 种 GraphExecutor |
| RAG | ai-platform-rag | 知识库 CRUD、文档切片、向量检索、3 种 ChunkStrategy |
| Skill | ai-platform-skill | 技能配置 CRUD、PF4J 插件管理、技能调用、5 个内置插件 |
| Chat | ai-platform-chat | 对话同步/流式、SSE 推送、会话管理 |
| Observability | ai-platform-observability | Micrometer 指标、PF4J 插件指标、审计日志、Langfuse Trace |
| Server | ai-platform-server | 启动入口、聚合所有模块 |

---

## ai-platform-common

### 核心类

| 类 | 路径 | 说明 |
| :--- | :--- | :--- |
| `R<T>` | result/R.java | 统一响应体，`R.ok(data)` / `R.fail(code, msg)` |
| `BizException` | exception/BizException.java | 业务异常，携带 code + message |
| `GlobalExceptionHandler` | exception/GlobalExceptionHandler.java | @RestControllerAdvice，处理 BizException / Validation / Generic |
| `@DistributedLock` | annotation/DistributedLock.java | Redisson 分布式锁注解，支持 SpEL key |
| `@RateLimit` | annotation/RateLimit.java | Redis Lua 令牌桶限流注解 |
| `RedisUtils` | utils/RedisUtils.java | Spring Data Redis 封装，String/Hash/Set/List/Increment |
| `DistributedLockAspect` | utils/DistributedLockAspect.java | AOP 切面，Redisson RLock + SpEL 解析 |
| `RateLimitAspect` | utils/RateLimitAspect.java | AOP 切面，Redis Lua 脚本令牌桶 |

### 枚举

| 枚举 | 值 |
| :--- | :--- |
| `AgentRole` | WORKER, ROUTER, SUPERVISOR |
| `OrchestrationPattern` | ROUTER_MOE, REACT, PLAN_AND_SOLVE, HIERARCHICAL |
| `InteractionMode` | SYNC, STREAM, COT |
| `SkillStatus` | ACTIVE, WARNING, INACTIVE |
| `KbStatus` | ACTIVE, SYNCING |

---

## ai-platform-plugin-sdk

插件与宿主共享的接口 SDK，所有 PF4J 插件必须依赖此模块。

| 类 | 说明 |
| :--- | :--- |
| `SkillExtension` | PF4J ExtensionPoint 接口，定义 `getSkillId()` / `getSkillName()` / `execute(SkillContext)` |
| `SkillContext` | 调用上下文：skillId, input, params, authConfig, endpoint |
| `SkillResult` | 执行结果：success, data, error, pluginId, durationMs |

---

## ai-platform-agent

### 智能体配置

| 类 | 说明 |
| :--- | :--- |
| `AgentConfig` | @TableName("t_agent_config")，包含 role/model/temperature/maxSteps/skillIds/knowledgeBaseIds |
| `AgentConfigDTO` | 创建/更新 DTO，含 @NotBlank/@NotNull 校验 |
| `AgentConfigMapper` | @DS("dm") BaseMapper |
| `AgentConfigService` | RedisUtils 缓存（2h TTL），CRUD + 缓存淘汰 |
| `AgentConfigController` | /api/agents CRUD |

### 编排引擎

| 类 | 说明 |
| :--- | :--- |
| `OrchestrationEngine` | 按 patternCode 分发到对应 GraphExecutor |
| `GraphExecutor` | 接口：`getPatternCode()` + `execute(OrchestrationRequest)` |
| `RouterMoEExecutor` | Router 分类意图 → 权重选择 Worker |
| `ReActExecutor` | Thought-Action-Observation 循环，附带 SkillTrace |
| `PlanAndSolveExecutor` | Planner 拆解 DAG → Executor 并行执行 |
| `HierarchicalExecutor` | Supervisor 委派 → Team Supervisor → Worker 执行 |

### 响应模型

`OrchestrationResponse` 包含：
- `content` — 最终回答
- `cotTrace` — 思维链文本
- `routedAgentId` — 被路由的智能体 ID
- `steps` — List<StepTrace>（step, action, observation）
- `skillTraces` — List<SkillTrace>（skillId, skillName, pluginId, success, durationMs, summary）

---

## ai-platform-skill

### PF4J 插件管理

| 类 | 说明 |
| :--- | :--- |
| `PluginManagerConfig` | SpringPluginManager 配置，从 `plugins/` 目录自动加载 |
| `SkillRegistry` | 基于 PF4J PluginManager 查找 SkillExtension，支持热插拔 |
| `SkillController` | 技能 CRUD + 插件生命周期 API |

### 内置插件（@Extension）

| 插件 | skillId | 说明 |
| :--- | :--- | :--- |
| VoiceTranscriptionTool | voice-transcription | 语音转写（ASR） |
| OcrTool | ocr-extraction | OCR 文档提取 |
| ElasticsearchTool | elasticsearch-search | ES 全文检索 |
| MysqlQueryTool | mysql-query | Doris/MySQL 数据查询 |
| ChatCleanTool | chat-record-clean | 聊天记录清洗与脱敏 |

---

## ai-platform-rag

| 类 | 说明 |
| :--- | :--- |
| `KnowledgeBase` | @TableName("t_knowledge_base")，vectorDb/embeddingModel/docs/status |
| `DocumentChunk` | @TableName("t_document_chunk")，kbId/content/chunkType/metadata |
| `VectorStoreFactory` | 按 vectorDb 类型创建 Milvus/ES/pgvector Store |
| `ChunkStrategy` | 接口：QA / Markdown / Triple 三种分块策略 |
| `RagService` | 知识库 CRUD + Redis 缓存 + ingest + search |
| `KnowledgeBaseController` | /api/knowledge-bases CRUD + ingest + search |

---

## ai-platform-chat

| 类 | 说明 |
| :--- | :--- |
| `ChatMessage` | role/content/cotTrace/agentId/skillTraces(timestamp) |
| `ChatRequest` | message + mode + agentWeights |
| `ChatSession` | sessionId + messages + agentWeights，Redis 存储（24h TTL） |
| `SseEmitter` | Reactor Sinks.Many<ChatMessage>，支持逐字推送 |
| `ChatService` | 同步/流式对话，编排后附带 skillTraces |
| `ChatController` | /api/chat/sync + /api/chat/stream |

---

## ai-platform-observability

### Micrometer 指标

| 指标名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `agent.orchestration.total` | Counter | 编排执行总数 |
| `agent.token.consumption` | Counter | Token 消耗总量 |
| `agent.orchestration.latency` | Timer | 编排执行耗时 |
| `agent.skill.invocation.total` | Counter | 技能调用总数 |
| `agent.rag.query.total` | Counter | RAG 查询总数 |
| `plugin.load.total` | Counter | 插件加载次数 |
| `plugin.start.total` | Counter | 插件启动次数 |
| `plugin.error.total` | Counter | 插件执行错误次数 |
| `plugin.execution.latency` | Timer | 插件执行耗时 |
| `plugin.loaded.count` | Gauge | 当前已加载插件数 |
| `plugin.started.count` | Gauge | 当前已启动插件数 |

### 审计与 Trace

| 类 | 说明 |
| :--- | :--- |
| `AuditLog` | @TableName("t_audit_log") @DS("doris")，含 pluginId/skillId/skillSuccess/skillDurationMs |
| `AuditService` | logOrchestration + logSkillInvocation |
| `LangfuseConfig` | @ConfigurationProperties(prefix="langfuse") |
| `LangfuseService` | trace/span 接口（需集成 Langfuse SDK） |