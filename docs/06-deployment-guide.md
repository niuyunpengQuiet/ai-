# 部署指南

## 1. 环境要求

| 组件 | 最低版本 | 说明 |
| :--- | :--- | :--- |
| JDK | 17 | 后端运行时 |
| Node.js | 18+ | 前端构建 |
| Maven | 3.8+ | 后端构建 |
| 达梦 DM | 8.1+ | 业务数据库 |
| Apache Doris | 2.0+ | 分析数据库 |
| Redis | 7.0+ | 缓存/分布式锁/限流 |
| Nacos | 2.4+ | 服务发现与配置中心 |
| Milvus | 2.4+ | 向量数据库（可选，RAG 功能需要） |
| Elasticsearch | 8.x | 全文检索（可选，混合检索需要） |

---

## 2. 基础设施部署

### 2.1 达梦 DM

```sql
-- 创建 Schema
CREATE SCHEMA AI_PLATFORM;
-- 执行建表脚本
-- 见 backend/ai-platform-server/src/main/resources/schema.sql
```

### 2.2 Apache Doris

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ai_platform_analytics;
-- 执行 Doris 建表脚本（schema.sql 中 Doris 部分）
```

### 2.3 Redis

```bash
# 无特殊配置，默认 6379 端口
# 如需密码，设置 REDIS_PASSWORD 环境变量
```

### 2.4 Nacos

```bash
# 启动 Nacos Server（单机模式）
sh startup.sh -m standalone

# 创建命名空间（可选）
# 创建配置组 AI_PLATFORM
```

---

## 3. 后端部署

### 3.1 环境变量

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `DM_USERNAME` | SYSDBA | 达梦用户名 |
| `DM_PASSWORD` | SYSDBA | 达梦密码 |
| `DORIS_HOST` | localhost | Doris 地址 |
| `DORIS_PORT` | 9030 | Doris 端口 |
| `DORIS_USERNAME` | root | Doris 用户名 |
| `DORIS_PASSWORD` | (空) | Doris 密码 |
| `REDIS_HOST` | localhost | Redis 地址 |
| `REDIS_PORT` | 6379 | Redis 端口 |
| `REDIS_PASSWORD` | (空) | Redis 密码 |
| `NACOS_ADDR` | localhost:8848 | Nacos 地址 |
| `NACOS_NAMESPACE` | public | Nacos 命名空间 |
| `AI_DASHSCOPE_API_KEY` | (空) | 阿里云 DashScope API Key |
| `LANGFUSE_PUBLIC_KEY` | (空) | Langfuse 公钥 |
| `LANGFUSE_SECRET_KEY` | (空) | Langfuse 私钥 |
| `LANGFUSE_BASE_URL` | https://cloud.langfuse.com | Langfuse 地址 |
| `LANGFUSE_ENABLED` | false | 是否启用 Langfuse |
| `PF4J_PLUGINS_DIR` | plugins | PF4J 插件目录 |
| `PF4J_AUTO_START` | true | 是否自动启动插件 |

### 3.2 构建

```bash
cd backend
mvn clean package -DskipTests
```

### 3.3 运行

```bash
java -jar ai-platform-server/target/ai-platform-server-1.0.0-SNAPSHOT.jar \
  --DM_USERNAME=SYSDBA \
  --DM_PASSWORD=your_password \
  --AI_DASHSCOPE_API_KEY=sk-xxx
```

### 3.4 PF4J 插件部署

将编译好的插件 JAR 放入 `plugins/` 目录：

```
项目根目录/
├── ai-platform-server-1.0.0-SNAPSHOT.jar
└── plugins/
    ├── skill-voice-transcription-1.0.0.jar
    ├── skill-ocr-extraction-1.0.0.jar
    ├── skill-elasticsearch-1.0.0.jar
    ├── skill-mysql-query-1.0.0.jar
    └── skill-chat-clean-1.0.0.jar
```

启动后自动加载，也可通过 API 热插拔：

```bash
# 重载所有插件
curl -X POST http://localhost:8080/api/skills/plugins/reload

# 停止某个插件
curl -X POST http://localhost:8080/api/skills/plugins/voice-transcription/stop

# 卸载某个插件
curl -X DELETE http://localhost:8080/api/skills/plugins/voice-transcription
```

---

## 4. 前端部署

### 4.1 开发模式

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

### 4.2 生产构建

```bash
npm run build
# 产物在 dist/ 目录
```

构建产物已配置代码分割：

| Chunk | 内容 | 大小约 |
| :--- | :--- | :--- |
| index.js | Vue + 业务代码 | ~150KB |
| element-plus.js | Element Plus + Icons | ~600KB |
| vue-flow.js | Vue Flow + 插件 | ~200KB |
| markdown.js | markdown-it + highlight.js | ~300KB |

### 4.3 Nginx 配置

```nginx
server {
    listen 80;
    server_name ai-platform.example.com;

    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Session-Id $http_x_session_id;
    }

    # SSE 代理（需关闭缓冲）
    location /api/chat/stream {
        proxy_pass http://backend:8080;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
    }
}
```

---

## 5. Docker Compose（一键启动）

```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  nacos:
    image: nacos/nacos-server:v2.4.3
    environment:
      MODE: standalone
    ports: ["8848:8848"]

  backend:
    build: ./backend
    ports: ["8080:8080"]
    environment:
      DM_USERNAME: SYSDBA
      DM_PASSWORD: SYSDBA
      REDIS_HOST: redis
      NACOS_ADDR: nacos:8848
      AI_DASHSCOPE_API_KEY: ${AI_DASHSCOPE_API_KEY}
    depends_on: [redis, nacos]
    volumes:
      - ./plugins:/app/plugins

  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]
```

---

## 6. 健康检查

```bash
# 后端健康检查
curl http://localhost:8080/actuator/health

# Prometheus 指标
curl http://localhost:8080/actuator/prometheus

# 插件状态
curl http://localhost:8080/api/skills/plugins
```