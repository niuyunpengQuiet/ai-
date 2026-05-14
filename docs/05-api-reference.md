# API 接口参考

所有接口返回统一响应体 `R<T>`：

```json
{ "code": 200, "message": "success", "data": T }
```

---

## 1. 智能体配置 `/api/agents`

| 方法 | 路径 | 说明 | 请求体 | 响应体 |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/agents | 列表 | — | `R<List<AgentConfig>>` |
| GET | /api/agents/{id} | 详情 | — | `R<AgentConfig>` |
| POST | /api/agents | 创建 | AgentConfigDTO | `R<AgentConfig>` |
| PUT | /api/agents/{id} | 更新 | AgentConfigDTO | `R<AgentConfig>` |
| DELETE | /api/agents/{id} | 删除 | — | `R<Void>` |

### AgentConfigDTO

```json
{
  "name": "涉黄案件审判专家",
  "role": "Worker",
  "model": "gpt-4o",
  "temperature": 0.1,
  "maxSteps": 5,
  "fallbackAgentId": "agt-router",
  "skillIds": ["sk-ocr"],
  "knowledgeBaseIds": ["kb-criminal-law"]
}
```

---

## 2. 编排执行 `/api/orchestration`

| 方法 | 路径 | 说明 | 请求体 | 响应体 |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/orchestration/execute | 执行编排 | OrchestrationRequest | `R<OrchestrationResponse>` |

限流：`@RateLimit(key="orchestration", permits=30, period=1s)`

### OrchestrationRequest

```json
{
  "userInput": "分析涉案资金流向",
  "pattern": "ROUTER_MOE",
  "mode": "STREAM",
  "agentWeights": { "agt-eco-02": 80, "agt-drug-03": 20 }
}
```

### OrchestrationResponse

```json
{
  "content": "联合研判分析报告...",
  "cotTrace": "1. [意图路由] ...\n2. [权重分配] ...",
  "routedAgentId": "agt-eco-02",
  "steps": [
    { "step": "1", "action": "Intent Classification", "observation": "识别为法务咨询类问题" }
  ],
  "skillTraces": [
    { "skillId": "elasticsearch-search", "skillName": "ES 全文检索", "pluginId": "elasticsearch-search", "success": true, "durationMs": 120, "summary": "检索到 3 条相关文档" }
  ]
}
```

---

## 3. 技能配置 `/api/skills`

| 方法 | 路径 | 说明 | 请求体 | 响应体 |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/skills | 技能列表 | — | `R<List<SkillConfig>>` |
| POST | /api/skills | 创建技能 | SkillConfigDTO | `R<SkillConfig>` |
| PUT | /api/skills/{id} | 更新技能 | SkillConfigDTO | `R<SkillConfig>` |
| DELETE | /api/skills/{id} | 删除技能 | — | `R<Void>` |
| POST | /api/skills/invoke | 调用技能 | SkillInvocation | `R<SkillResult>` |

### SkillInvocation

```json
{
  "skillId": "elasticsearch-search",
  "input": "搜索涉案资金记录",
  "params": { "index": "case_records", "size": 10 }
}
```

---

## 4. PF4J 插件生命周期 `/api/skills/plugins`

| 方法 | 路径 | 说明 | 响应体 |
| :--- | :--- | :--- | :--- |
| GET | /api/skills/plugins | 列出所有插件 | `R<List<{pluginId, state, path, version}>>` |
| GET | /api/skills/extensions | 列出所有 SkillExtension | `R<List<{skillId, name, version}>>` |
| POST | /api/skills/plugins/reload | 重载所有插件 | `R<Integer>` (扩展数量) |
| POST | /api/skills/plugins/{pluginId}/start | 启动插件 | `R<Boolean>` |
| POST | /api/skills/plugins/{pluginId}/stop | 停止插件 | `R<Boolean>` |
| DELETE | /api/skills/plugins/{pluginId} | 卸载插件 | `R<Boolean>` |

---

## 5. 知识库 `/api/knowledge-bases`

| 方法 | 路径 | 说明 | 请求体 | 响应体 |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/knowledge-bases | 知识库列表 | — | `R<List<KnowledgeBase>>` |
| POST | /api/knowledge-bases | 创建知识库 | KnowledgeBaseDTO | `R<KnowledgeBase>` |
| DELETE | /api/knowledge-bases/{id} | 删除知识库 | — | `R<Void>` |
| POST | /api/knowledge-bases/{id}/ingest | 文档入库向量化 | templateType + content | `R<Void>` |
| POST | /api/knowledge-bases/search | 向量检索 | RagQuery | `R<RagResult>` |

---

## 6. 对话 `/api/chat`

| 方法 | 路径 | 说明 | 请求头 | 请求体 | 响应体 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | /api/chat/sync | 同步对话 | X-Session-Id | ChatRequest | `R<ChatMessage>` |
| POST | /api/chat/stream | 流式对话 | X-Session-Id | ChatRequest | `Flux<ChatMessage>` (SSE) |

限流：sync 20/s, stream 10/s

### ChatRequest

```json
{
  "message": "分析涉案资金流向",
  "mode": "STREAM",
  "agentWeights": { "agt-eco-02": 80 }
}
```

### ChatMessage (SSE)

```json
{
  "role": "agent",
  "content": "联合研判分析报告...",
  "cotTrace": "1. [意图路由] ...",
  "agentId": "agt-eco-02",
  "skillTraces": [
    { "skillId": "elasticsearch-search", "skillName": "ES 全文检索", "pluginId": "...", "success": true, "durationMs": 120, "summary": "..." }
  ],
  "timestamp": "2026-05-12T18:30:00"
}
```

---

## 7. 监控 `/actuator`

| 路径 | 说明 |
| :--- | :--- |
| /actuator/health | 健康检查 |
| /actuator/prometheus | Prometheus 指标 |
| /actuator/metrics | Micrometer 指标列表 |