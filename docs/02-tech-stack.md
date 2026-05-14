# 技术栈总览

## 前端技术栈

| 模块 | 技术 | 版本 | 核心作用 |
| :--- | :--- | :--- | :--- |
| 核心框架 | Vue 3 + TypeScript + Vite | 3.5 / 5.8 / 6.2 | 现代化开发体验，保障大型项目的可维护性 |
| UI 组件库 | Element Plus | 2.9 | 快速构建中后台页面，兼顾复杂表单与交互 |
| 状态管理 | Pinia | 2.3 | 管理多智能体挂载、品牌切换等全局复杂状态 |
| 可视化编排 | Vue Flow | 1.41 | 实现 Plan-and-Solve 的 DAG 任务拆解与拖拽编排 |
| 流式渲染 | markdown-it + highlight.js | 14.1 / 11.11 | 完美呈现 AI 的流式对话、思维链与代码块 |

## 后端技术栈

| 模块 | 技术 | 版本 | 核心作用 |
| :--- | :--- | :--- | :--- |
| 核心框架 | Spring Boot 3 | 3.3.6 | 基础运行时，JDK 17 |
| 多智能体编排 | Spring AI Alibaba | 1.0.0-M2 | 顶层业务逻辑编排（Router/Supervisor），无感调用底层技能 |
| 技能库与微服务 | PF4J + Spring Boot 3 | 3.12.0 | 物理隔离与热插拔，技能以插件形式独立打包、独立部署 |
| RAG 与底层能力 | LangChain4j | 0.36.2 | 向量化与知识库检索，作为基础能力封装在核心层或独立插件中 |
| 交互与流式输出 | Spring WebFlux + SSE | — | 将 AI 的思考过程（包括调用了哪个插件）实时推送给前端 |
| 可观测性 | Micrometer + Prometheus | — | 监控 Token 消耗、插件加载状态、执行耗时与异常率 |
| AI Trace | Langfuse | — | 编排链路的 Trace/Span 追踪 |
| ORM | MyBatis-Plus | 3.5.9 | 业务数据持久化 |
| 多数据源 | Dynamic DataSource | 4.3.1 | 达梦 + Doris 双数据源切换 |
| 业务数据库 | 达梦 DM | 8.1.3 | 核心业务数据（智能体、技能、知识库配置） |
| 分析数据库 | Apache Doris | — | 审计日志、会话历史、指标聚合 |
| 缓存与分布式锁 | Redis + Redisson | 7.x / 3.36.2 | 缓存、会话、分布式锁、限流 |
| 服务发现与配置 | Nacos | 2.4.3 | 服务注册与动态配置 |
| 向量数据库 | Milvus / Elasticsearch / pgvector | 2.4.4 | 知识库向量检索 |

---

## 关键依赖版本矩阵

### 前端 (package.json)

```json
{
  "vue": "^3.5.13",
  "element-plus": "^2.9.1",
  "@element-plus/icons-vue": "^2.3.1",
  "pinia": "^2.3.0",
  "@vue-flow/core": "^1.41.5",
  "@vue-flow/background": "^1.3.2",
  "@vue-flow/controls": "^1.1.3",
  "@vue-flow/minimap": "^1.5.2",
  "markdown-it": "^14.1.0",
  "highlight.js": "^11.11.1",
  "vite": "^6.2.3",
  "typescript": "~5.8.2"
}
```

### 后端 (pom.xml)

```xml
<spring-boot>3.3.6</spring-boot>
<java.version>17</java.version>
<spring-ai-alibaba.version>1.0.0-M2</spring-ai-alibaba.version>
<langchain4j.version>0.36.2</langchain4j.version>
<mybatis-plus.version>3.5.9</mybatis-plus.version>
<dynamic-datasource.version>4.3.1</dynamic-datasource.version>
<nacos.version>2.4.3</nacos.version>
<milvus-sdk.version>2.4.4</milvus-sdk.version>
<dm-jdbc.version>8.1.3.62</dm-jdbc.version>
<redisson.version>3.36.2</redisson.version>
<pf4j.version>3.12.0</pf4j.version>
```