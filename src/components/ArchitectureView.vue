<template>
  <div class="architecture-view">
    <div class="arch-layout">
      <!-- Pattern Selector -->
      <div :class="['pattern-sidebar', { collapsed: sidebarCollapsed }]">
        <div class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon :size="14">
            <component :is="sidebarCollapsed ? 'DArrowRight' : 'DArrowLeft'" />
          </el-icon>
        </div>

        <template v-if="!sidebarCollapsed">
          <label class="pattern-label">Architecture Patterns</label>
          <div
            v-for="p in PATTERNS"
            :key="p.id"
            :class="['pattern-btn', { active: activePattern === p.id }]"
            @click="switchPattern(p.id)"
          >
            <div class="pattern-name">{{ p.name }}</div>
            <div class="pattern-desc">{{ p.desc }}</div>
          </div>
        </template>
      </div>

      <!-- Vue Flow Graph Area -->
      <div class="graph-area">
        <VueFlow
          :nodes="nodes"
          :edges="edges"
          :default-viewport="{ zoom: 0.8, x: 0, y: 0 }"
          :min-zoom="0.3"
          :max-zoom="2.0"
          fit-on-init
          class="vue-flow-instance"
        >
          <Background :gap="20" :size="1" pattern-color="#e2e8f0" />
          <Controls position="bottom-right" />
          <MiniMap position="bottom-left" :pannable="true" :zoomable="true" />

          <!-- Custom Node Templates -->
          <template #node-orchestrator="nodeProps">
            <OrchestratorNode v-bind="nodeProps" />
          </template>
          <template #node-worker="nodeProps">
            <WorkerNode v-bind="nodeProps" />
          </template>
          <template #node-router="nodeProps">
            <RouterNode v-bind="nodeProps" />
          </template>
          <template #node-supervisor="nodeProps">
            <SupervisorNode v-bind="nodeProps" />
          </template>
          <template #node-planner="nodeProps">
            <PlannerNode v-bind="nodeProps" />
          </template>
          <template #node-executor="nodeProps">
            <ExecutorNode v-bind="nodeProps" />
          </template>
          <template #node-tool="nodeProps">
            <ToolNode v-bind="nodeProps" />
          </template>
          <template #node-user="nodeProps">
            <UserNode v-bind="nodeProps" />
          </template>

          <!-- Custom Edge -->
          <template #edge-custom="edgeProps">
            <CustomEdge v-bind="edgeProps" />
          </template>
        </VueFlow>

        <!-- Info Panel (collapsible) -->
        <div :class="['info-panel', { expanded: infoExpanded }]">
          <div class="info-header" @click="infoExpanded = !infoExpanded">
            <div class="info-title">
              <el-icon :size="14"><InfoFilled /></el-icon>
              <strong>设计意图 (Purpose)</strong>
            </div>
            <el-icon :size="12" :class="{ 'rotate-arrow': infoExpanded }">
              <ArrowUp />
            </el-icon>
          </div>
          <transition name="slide">
            <div v-if="infoExpanded" class="info-body">
              {{ activeDesc }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { InfoFilled, ArrowUp, DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import OrchestratorNode from './flow/OrchestratorNode.vue';
import WorkerNode from './flow/WorkerNode.vue';
import RouterNode from './flow/RouterNode.vue';
import SupervisorNode from './flow/SupervisorNode.vue';
import PlannerNode from './flow/PlannerNode.vue';
import ExecutorNode from './flow/ExecutorNode.vue';
import ToolNode from './flow/ToolNode.vue';
import UserNode from './flow/UserNode.vue';
import CustomEdge from './flow/CustomEdge.vue';

const PATTERNS = [
  { id: 'router-moe', name: '基于路由的混合专家 (MoE)', desc: '动态分发意图至领域专家，适合边界清晰的任务分类', purpose: '通过前置的轻量级分类模型，将用户请求精准分发给擅长该领域的专家智能体，从而在保证专业性的同时优化整体大模型的调用成本与响应延迟。' },
  { id: 'react', name: 'ReAct 推理执行闭环', desc: '单体 / 多体推理与动作协同', purpose: '大模型交替进行"思考(Thought)"与"行动(Action)"，能够自主调用检索、代码沙盒等工具获取外部信息，直到得出最终结论。适合需要多步信息收集的复杂问题。' },
  { id: 'plan-solve', name: 'Plan-and-Solve 调度', desc: '规划器拆解任务，执行者完成', purpose: '面对极其复杂的长线任务，先由规划智能体(Planner)拆解出DAG(有向无环图)格式的子任务，再交由执行智能体(Executor)去并行或顺序完成，大幅提升任务成功率。' },
  { id: 'hierarchical', name: '层级化多智能体', desc: '主管 (Supervisor) 协调网状团队', purpose: '在大型团队协作场景中，设立各级主管/裁判(Supervisor)。主管不直接处理具体工作，而是负责将任务委派给下属的专职智能体，并审核他们的结果。' },
];

const activePattern = ref(PATTERNS[0].id);
const activeDesc = computed(() => PATTERNS.find(p => p.id === activePattern.value)?.purpose);
const infoExpanded = ref(true);
const sidebarCollapsed = ref(false);

// Vue Flow instance
const { fitView } = useVueFlow();

// Node & Edge definitions per pattern
const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);

const patternGraphs: Record<string, { nodes: any[]; edges: any[] }> = {
  'router-moe': {
    nodes: [
      { id: 'orch-1', type: 'orchestrator', position: { x: 250, y: 0 }, data: { label: 'Orchestration Service', desc: '意图路由与会话控制', subItems: ['Intent Classifier', 'Weight Adjuster'] } },
      { id: 'worker-1', type: 'worker', position: { x: 0, y: 250 }, data: { label: '法务专家 Worker', desc: '刑法与相关解释知识库', color: 'indigo' } },
      { id: 'worker-2', type: 'worker', position: { x: 250, y: 250 }, data: { label: '经侦专家 Worker', desc: '资金流动分析与图谱计算', color: 'emerald' } },
      { id: 'worker-3', type: 'worker', position: { x: 500, y: 250 }, data: { label: '禁毒专家 Worker', desc: '涉毒黑话与暗语辅助判别', color: 'amber' } },
    ],
    edges: [
      { id: 'e-orch-1', source: 'orch-1', target: 'worker-1', type: 'custom', data: { label: '路由分发' } },
      { id: 'e-orch-2', source: 'orch-1', target: 'worker-2', type: 'custom', data: { label: '路由分发' } },
      { id: 'e-orch-3', source: 'orch-1', target: 'worker-3', type: 'custom', data: { label: '路由分发' } },
    ],
  },
  'react': {
    nodes: [
      { id: 'user-1', type: 'user', position: { x: 250, y: 0 }, data: { label: 'User Query' } },
      { id: 'react-1', type: 'orchestrator', position: { x: 250, y: 150 }, data: { label: 'ReAct Agent', desc: 'Thought, Action, Observation', subItems: ['Thought: 分析意图', 'Action: SearchTool()', 'Observation: ES检索3条'] } },
      { id: 'tool-1', type: 'tool', position: { x: 250, y: 350 }, data: { label: 'Tools / Skills', desc: '外部能力与沙盒' } },
    ],
    edges: [
      { id: 'e-user-react', source: 'user-1', target: 'react-1', type: 'custom', data: { label: '输入' } },
      { id: 'e-react-tool', source: 'react-1', target: 'tool-1', type: 'custom', data: { label: '调用工具' } },
      { id: 'e-tool-react', source: 'tool-1', target: 'react-1', type: 'custom', animated: true, data: { label: '返回结果' } },
    ],
  },
  'plan-solve': {
    nodes: [
      { id: 'planner-1', type: 'planner', position: { x: 250, y: 0 }, data: { label: 'Planner (规划器)', desc: '将复杂涉案诉求拆解为DAG子任务', steps: ['1. 提取资金流', '2. 匹配洗钱模型', '3. 生成报告'] } },
      { id: 'exec-1', type: 'executor', position: { x: 100, y: 250 }, data: { label: 'Executor A (执行)', desc: '数据提取模块' } },
      { id: 'exec-2', type: 'executor', position: { x: 400, y: 250 }, data: { label: 'Executor B (执行)', desc: '分析聚合模块' } },
    ],
    edges: [
      { id: 'e-plan-a', source: 'planner-1', target: 'exec-1', type: 'custom', data: { label: '子任务A' } },
      { id: 'e-plan-b', source: 'planner-1', target: 'exec-2', type: 'custom', data: { label: '子任务B' } },
    ],
  },
  'hierarchical': {
    nodes: [
      { id: 'super-1', type: 'supervisor', position: { x: 250, y: 0 }, data: { label: 'Top Supervisor (总管)', desc: '全盘调配，不亲自办案' } },
      { id: 'super-2', type: 'supervisor', position: { x: 50, y: 200 }, data: { label: '侦查梳理小队', desc: 'Team Supervisor', color: 'indigo' } },
      { id: 'super-3', type: 'supervisor', position: { x: 450, y: 200 }, data: { label: '法务审计小队', desc: 'Team Supervisor', color: 'amber' } },
      { id: 'worker-1', type: 'worker', position: { x: -50, y: 380 }, data: { label: '取证专家', desc: '', color: 'indigo' } },
      { id: 'worker-2', type: 'worker', position: { x: 150, y: 380 }, data: { label: '现场勘查', desc: '', color: 'indigo' } },
      { id: 'worker-3', type: 'worker', position: { x: 350, y: 380 }, data: { label: '卷宗分析', desc: '', color: 'amber' } },
      { id: 'worker-4', type: 'worker', position: { x: 550, y: 380 }, data: { label: '合规审查', desc: '', color: 'amber' } },
    ],
    edges: [
      { id: 'e-top-2', source: 'super-1', target: 'super-2', type: 'custom', data: { label: '委派' } },
      { id: 'e-top-3', source: 'super-1', target: 'super-3', type: 'custom', data: { label: '委派' } },
      { id: 'e-2-1', source: 'super-2', target: 'worker-1', type: 'custom', data: { label: '分配' } },
      { id: 'e-2-2', source: 'super-2', target: 'worker-2', type: 'custom', data: { label: '分配' } },
      { id: 'e-3-3', source: 'super-3', target: 'worker-3', type: 'custom', data: { label: '分配' } },
      { id: 'e-3-4', source: 'super-3', target: 'worker-4', type: 'custom', data: { label: '分配' } },
    ],
  },
};

function switchPattern(id: string) {
  activePattern.value = id;
  const graph = patternGraphs[id];
  nodes.value = [...graph.nodes];
  edges.value = [...graph.edges];
  setTimeout(() => fitView({ padding: 0.15 }), 100);
}

// Initialize with first pattern
switchPattern(PATTERNS[0].id);
</script>

<style scoped>
.architecture-view {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.arch-layout {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.pattern-sidebar {
  width: 288px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  position: relative;
  transition: width 0.3s ease, padding 0.3s ease;
}
.pattern-sidebar.collapsed {
  width: 48px;
  padding: 16px 8px;
  align-items: center;
}

.sidebar-toggle {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-bottom: 4px;
}
.sidebar-toggle:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}
.pattern-sidebar.collapsed .sidebar-toggle {
  margin-bottom: 0;
}

.pattern-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 8px;
  padding-left: 4px;
}
.pattern-btn {
  width: 100%;
  text-align: left;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}
.pattern-btn:hover {
  border-color: #cbd5e1;
}
.pattern-btn.active {
  background: #eef2ff;
  border-color: #c7d2fe;
  box-shadow: 0 0 0 1px #818cf8;
}
.pattern-name {
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
}
.pattern-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.graph-area {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.vue-flow-instance {
  width: 100%;
  height: 100%;
}

.info-panel {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 4;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}
.info-header:hover {
  background: #f8fafc;
}
.info-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4f46e5;
}
.info-title strong {
  color: #1e293b;
  font-size: 13px;
}
.rotate-arrow {
  transform: rotate(180deg);
  transition: transform 0.2s;
}
.info-body {
  padding: 0 14px 12px;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  max-height: 200px;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
