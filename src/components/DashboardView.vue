<template>
  <div class="dashboard-view">
    <h2 class="view-title">系统总览</h2>
    <p class="view-subtitle">实时监控多智能体调度与资源状态。</p>

    <!-- Stat Cards -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">{{ stat.title }}</span>
            <div class="stat-icon">
              <el-icon :size="16"><component :is="stat.icon" /></el-icon>
            </div>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-footer">
            <span :class="['stat-trend', stat.trend >= 0 ? 'up' : 'down']">
              {{ stat.trend >= 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="stat-sub">{{ stat.subtitle }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Chart + Audit -->
    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="16">
        <div class="view-card">
          <div class="chart-header">
            <h3>分层路由请求量 (7天)</h3>
            <el-tag size="small" type="info" effect="plain">更新时间: 刚刚</el-tag>
          </div>
          <div class="chart-bars">
            <div v-for="(v, i) in chartData" :key="i" class="bar-group">
              <div class="bar-bg" :style="{ height: v + '%' }">
                <div class="bar-fg" :style="{ height: (v * 0.4) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot fg"></span>小模型 Router</span>
            <span class="legend-item"><span class="legend-dot bg"></span>大模型 / 专家 Worker</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="view-card">
          <h3 style="font-weight: 600; margin-bottom: 20px;">实时编排审计</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(log, i) in auditLogs"
              :key="i"
              :timestamp="log.time"
              placement="top"
              color="#94a3b8"
            >
              <div class="audit-title">{{ log.title }}</div>
              <div class="audit-desc">{{ log.desc }}</div>
              <el-tag size="small" type="info" effect="plain" style="margin-top: 6px;">{{ log.status }}</el-tag>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAgentStore, useSkillStore, useKnowledgeStore } from '../stores/agent';

const agentStore = useAgentStore();
const skillStore = useSkillStore();
const knowledgeStore = useKnowledgeStore();

const stats = computed(() => [
  { title: '活跃智能体', value: agentStore.agents.length, subtitle: '较上周', icon: 'Cpu', trend: 12 },
  { title: '插拔式技能', value: skillStore.skills.length, subtitle: '已挂载至集群', icon: 'Box', trend: 8 },
  { title: '知识库总切片', value: knowledgeStore.knowledgeBases.reduce((a, b) => a + b.docs, 0).toLocaleString(), subtitle: '向量库检索就绪', icon: 'Reading', trend: 24 },
  { title: '编排调度 QPS', value: '1,248', subtitle: '请求并发量', icon: 'TrendCharts', trend: -3 },
]);

const chartData = [40, 60, 45, 80, 50, 90, 75, 40, 60, 85, 70, 95, 60, 50, 80];

const auditLogs = [
  { title: 'Router -> 经济犯罪研判专家', desc: '由于存在资金流向分析诉求，正在切换专家实体', time: '2分钟前', status: '智能路由' },
  { title: 'Supervisor -> 涉毒案件侦查专家', desc: '发现不明黑话，拉取暗语库辅助研判', time: '5分钟前', status: '挂载成功' },
  { title: 'Gateway -> Router', desc: '快速处理普通的问询请求', time: '12分钟前', status: '即时响应' },
  { title: 'Query Vector DB', desc: '正在查询「刑法与相关司法解释」进行定罪判断', time: '18分钟前', status: 'RAG 融合' },
];
</script>

<style scoped>
.dashboard-view {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.stat-title {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}
.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}
.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
}
.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.stat-trend {
  font-size: 12px;
  font-weight: 500;
}
.stat-trend.up { color: #059669; }
.stat-trend.down { color: #dc2626; }
.stat-sub {
  font-size: 12px;
  color: #64748b;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.chart-header h3 {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
}

.chart-bars {
  height: 256px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
  border-left: 1px solid #f1f5f9;
  padding: 0 8px 8px 8px;
}
.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}
.bar-bg {
  width: 100%;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 2px 2px 0 0;
  position: relative;
  transition: background 0.2s;
}
.bar-group:hover .bar-bg {
  background: rgba(99, 102, 241, 0.3);
}
.bar-fg {
  width: 100%;
  background: #4f46e5;
  border-radius: 2px 2px 0 0;
  position: absolute;
  bottom: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
  font-size: 12px;
  color: #64748b;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-dot.fg { background: #4f46e5; }
.legend-dot.bg { background: rgba(99, 102, 241, 0.15); }

.audit-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}
.audit-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}
</style>