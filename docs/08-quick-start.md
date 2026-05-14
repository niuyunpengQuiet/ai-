# 快速入门

## 1. 前置条件

确保本地已安装：

| 工具 | 版本 | 验证命令 |
| :--- | :--- | :--- |
| JDK | 17+ | `java -version` |
| Maven | 3.8+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Redis | 7.0+ | `redis-cli ping` |

> 最小化体验只需 Redis，其余中间件（DM、Doris、Nacos、Milvus、ES）可后续按需接入。

---

## 2. 5 分钟启动（最小化）

### 2.1 启动 Redis

```bash
# Docker 一键启动
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 2.2 启动后端

```bash
cd backend

# 构建
mvn clean package -DskipTests

# 启动（使用内嵌 H2 替代 DM，无需数据库）
java -jar ai-platform-server/target/ai-platform-server-1.0.0-SNAPSHOT.jar \
  --spring.profiles.active=dev \
  --REDIS_HOST=localhost \
  --REDIS_PORT=6379
```

启动成功后访问 http://localhost:8080/actuator/health 确认健康。

### 2.3 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 开发模式启动
npm run dev
```

访问 http://localhost:3000 即可看到平台界面。

---

## 3. 功能验证清单

### 3.1 系统总览

- [ ] 访问 Dashboard，确认 4 张统计卡片正常显示
- [ ] 柱状图展示 7 天路由请求量
- [ ] 审计时间线展示最近编排事件

### 3.2 架构拓扑

- [ ] 切换 4 种编排模式（Router MoE / ReAct / Plan & Solve / Hierarchical）
- [ ] DAG 节点可拖拽、缩放
- [ ] MiniMap 导航正常

### 3.3 智能体管理

- [ ] 查看智能体列表
- [ ] 新建智能体（填写名称、角色、模型、温度等）
- [ ] 编辑智能体
- [ ] 删除智能体（弹出确认框）

### 3.4 技能库

- [ ] 查看技能卡片列表
- [ ] 状态徽章正确显示（active/warning/inactive）

### 3.5 知识库

- [ ] 查看知识库卡片
- [ ] 打开编辑抽屉，选择模板类型
- [ ] 填写知识集信息

### 3.6 对话调试

- [ ] 选择智能体并调整权重
- [ ] 切换交互模式（同步/流式）
- [ ] 发送消息，验证流式逐字输出
- [ ] 展开思维链折叠面板
- [ ] Markdown 渲染正常（代码高亮、列表、标题）
- [ ] 技能调用轨迹（SkillTrace）展示

---

## 4. PF4J 插件体验

### 4.1 查看已加载插件

```bash
curl http://localhost:8080/api/skills/plugins
```

### 4.2 查看技能扩展

```bash
curl http://localhost:8080/api/skills/extensions
```

### 4.3 调用技能

```bash
curl -X POST http://localhost:8080/api/skills/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "skillId": "elasticsearch-search",
    "input": "搜索涉案资金记录",
    "params": { "index": "case_records", "size": 10 }
  }'
```

### 4.4 热插拔操作

```bash
# 重载所有插件
curl -X POST http://localhost:8080/api/skills/plugins/reload

# 停止某个插件
curl -X POST http://localhost:8080/api/skills/plugins/elasticsearch-search/stop

# 启动插件
curl -X POST http://localhost:8080/api/skills/plugins/elasticsearch-search/start
```

### 4.5 开发自定义插件

详见 [插件开发指南](07-plugin-development.md)。

---

## 5. 完整环境部署

如需对接达梦 DM、Apache Doris、Nacos、Milvus、Elasticsearch 等中间件，参见 [部署指南](06-deployment-guide.md)。

### Docker Compose 一键启动

```bash
# 在项目根目录创建 .env 文件
echo "AI_DASHSCOPE_API_KEY=sk-your-key" > .env

# 启动所有服务
docker compose up -d
```

---

## 6. 常见问题

| 问题 | 原因 | 解决方案 |
| :--- | :--- | :--- |
| 后端启动报 `DM连接失败` | 未配置达梦数据库 | 使用 `--spring.profiles.active=dev` 启动开发模式 |
| 前端 `npm install` 报错 | 网络或 Node 版本问题 | 检查 Node >= 18，尝试 `npm config set registry https://registry.npmmirror.com` |
| 插件列表为空 | plugins 目录无 JAR | 将插件 JAR 放入 `plugins/` 目录后调用 reload API |
| SSE 流式无响应 | Nginx 缓冲了 SSE | Nginx 配置 `proxy_buffering off`，详见部署指南 |
| Vue Flow 节点不显示 | 浏览器兼容性 | 使用 Chrome 90+ 或 Edge 90+ |
| Redis 连接超时 | Redis 未启动 | 执行 `redis-cli ping` 确认 Redis 运行中 |

---

## 7. 项目结构速览

```
ai-platform/
├── backend/
│   ├── ai-platform-common/          # 统一响应体、异常、注解、工具
│   ├── ai-platform-plugin-sdk/      # PF4J 插件 SDK（SkillExtension 接口）
│   ├── ai-platform-datasource/      # 多数据源配置（DM + Doris + Redis）
│   ├── ai-platform-agent/           # 智能体配置 + 编排引擎
│   ├── ai-platform-skill/           # 技能配置 + PF4J 插件管理 + 内置插件
│   ├── ai-platform-rag/             # 知识库 + 向量检索
│   ├── ai-platform-chat/            # 对话同步/流式 + SSE
│   ├── ai-platform-observability/   # 指标 + 审计 + Trace
│   └── ai-platform-server/          # 启动入口
├── frontend/
│   ├── src/
│   │   ├── main.ts                  # Vue createApp + Pinia + Element Plus
│   │   ├── App.vue                  # 主布局（侧边栏 + 视图切换）
│   │   ├── stores/                  # Pinia 状态管理
│   │   └── components/              # 6 大视图 + Vue Flow 自定义节点
│   └── vite.config.ts
├── docs/                            # 项目文档
└── plugins/                         # PF4J 插件 JAR 部署目录
```

---

## 8. 下一步

- 阅读 [系统架构](01-system-architecture.md) 了解整体设计
- 阅读 [后端模块详解](03-backend-modules.md) 深入各模块实现
- 阅读 [API 接口参考](05-api-reference.md) 对接后端接口
- 阅读 [插件开发指南](07-plugin-development.md) 开发自定义技能插件
