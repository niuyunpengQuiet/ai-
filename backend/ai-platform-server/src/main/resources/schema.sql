-- ============================================================
-- AI Platform Schema - DM (Dameng) Business Tables
-- ============================================================

-- Agent Configuration
CREATE TABLE IF NOT EXISTS t_agent_config (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    name            VARCHAR(128)  NOT NULL,
    role            VARCHAR(32)   NOT NULL,
    model           VARCHAR(64)   NOT NULL,
    temperature     DECIMAL(3,2)  DEFAULT 0.70,
    max_steps       INT           DEFAULT 5,
    fallback_agent  VARCHAR(64),
    skill_ids       CLOB,
    knowledge_base_ids CLOB,
    status          VARCHAR(16)   DEFAULT 'active',
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Skill Configuration (metadata, actual execution via PF4J plugins)
CREATE TABLE IF NOT EXISTS t_skill_config (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    name            VARCHAR(128)  NOT NULL,
    plugin_id       VARCHAR(128),
    skill_type      VARCHAR(32)   NOT NULL,
    provider        VARCHAR(128),
    auth_type       VARCHAR(32),
    endpoint        VARCHAR(512),
    status          VARCHAR(16)   DEFAULT 'active',
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Plugin Registry (PF4J plugin lifecycle tracking)
CREATE TABLE IF NOT EXISTS t_plugin_registry (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    plugin_id       VARCHAR(128)  NOT NULL,
    plugin_path     VARCHAR(512)  NOT NULL,
    version         VARCHAR(32),
    state           VARCHAR(32)   DEFAULT 'LOADED',
    loaded_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    started_at      TIMESTAMP,
    stopped_at      TIMESTAMP,
    error_message   CLOB
);

-- Plugin Execution Log (per-invocation audit)
CREATE TABLE IF NOT EXISTS t_plugin_execution_log (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    plugin_id       VARCHAR(128)  NOT NULL,
    skill_id        VARCHAR(64)   NOT NULL,
    session_id      VARCHAR(64),
    success         INT           DEFAULT 1,
    duration_ms     BIGINT,
    error_message   CLOB,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Base
CREATE TABLE IF NOT EXISTS t_knowledge_base (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    name            VARCHAR(128)  NOT NULL,
    embedding_model VARCHAR(64)   NOT NULL,
    vector_db       VARCHAR(32)   NOT NULL,
    chunk_strategy  VARCHAR(32)   DEFAULT 'qa',
    docs            INT           DEFAULT 0,
    status          VARCHAR(16)   DEFAULT 'active',
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Document Chunks
CREATE TABLE IF NOT EXISTS t_document_chunk (
    id              VARCHAR(64)   NOT NULL PRIMARY KEY,
    kb_id           VARCHAR(64)   NOT NULL,
    content         CLOB          NOT NULL,
    chunk_type      VARCHAR(16)   DEFAULT 'qa',
    metadata        CLOB,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- AI Platform Schema - Doris Analytics Tables
-- ============================================================

-- Audit Log (UNIQUE KEY for real-time updates)
CREATE TABLE IF NOT EXISTS t_audit_log (
    trace_id        VARCHAR(64)   NOT NULL COMMENT '链路追踪ID',
    session_id      VARCHAR(64)   NOT NULL COMMENT '会话ID',
    agent_id        VARCHAR(64)   NOT NULL COMMENT '智能体ID',
    pattern         VARCHAR(32)   NOT NULL COMMENT '编排模式',
    input_hash      VARCHAR(128)  COMMENT '输入摘要',
    output_hash     VARCHAR(128)  COMMENT '输出摘要',
    token_count     BIGINT        DEFAULT 0 COMMENT 'Token消耗',
    duration_ms     BIGINT        DEFAULT 0 COMMENT '执行耗时',
    plugin_id       VARCHAR(128)  COMMENT '调用的插件ID',
    skill_id        VARCHAR(64)   COMMENT '调用的技能ID',
    skill_success   INT           COMMENT '技能调用是否成功',
    skill_duration_ms BIGINT      COMMENT '技能调用耗时',
    status          VARCHAR(16)   DEFAULT 'SUCCESS' COMMENT '执行状态',
    created_at      DATETIME      NOT NULL COMMENT '创建时间'
)
UNIQUE KEY (trace_id, session_id, agent_id)
DISTRIBUTED BY HASH(trace_id) BUCKETS 8
PROPERTIES (
    "replication_num" = "1",
    "enable_unique_key_merge_on_write" = "true"
);

-- Chat History (DUPLICATE KEY for append-only)
CREATE TABLE IF NOT EXISTS t_chat_history (
    id              VARCHAR(64)   NOT NULL COMMENT '消息ID',
    session_id      VARCHAR(64)   NOT NULL COMMENT '会话ID',
    role            VARCHAR(16)   NOT NULL COMMENT '角色(user/agent/system)',
    content         TEXT          COMMENT '消息内容',
    agent_id        VARCHAR(64)   COMMENT '智能体ID',
    cot_trace       TEXT          COMMENT '思维链',
    skill_traces    TEXT          COMMENT '技能调用追踪(JSON)',
    created_at      DATETIME      NOT NULL COMMENT '创建时间'
)
DUPLICATE KEY (id, session_id)
DISTRIBUTED BY HASH(session_id) BUCKETS 8
PROPERTIES (
    "replication_num" = "1"
);

-- Metrics Hourly (AGGREGATE KEY for pre-aggregation)
CREATE TABLE IF NOT EXISTS t_metrics_hourly (
    metric_time     DATETIME      NOT NULL COMMENT '统计时间(整点)',
    metric_name     VARCHAR(64)   NOT NULL COMMENT '指标名称',
    agent_id        VARCHAR(64)   NOT NULL COMMENT '智能体ID',
    pattern         VARCHAR(32)   COMMENT '编排模式',
    plugin_id       VARCHAR(128)  COMMENT '插件ID',
    skill_id        VARCHAR(64)   COMMENT '技能ID',
    value_sum       BIGINT        SUM COMMENT '指标值求和',
    value_count     BIGINT        SUM COMMENT '指标值计数',
    duration_ms_sum BIGINT        SUM COMMENT '耗时求和',
    error_count     BIGINT        SUM COMMENT '错误计数'
)
AGGREGATE KEY (metric_time, metric_name, agent_id, pattern, plugin_id, skill_id)
DISTRIBUTED BY HASH(metric_time) BUCKETS 4
PROPERTIES (
    "replication_num" = "1"
);