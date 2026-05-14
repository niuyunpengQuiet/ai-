<template>
  <div class="node-card planner">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon planner-icon"><el-icon><Document /></el-icon></div>
      <div>
        <h3>{{ data.label }}</h3>
        <p v-if="data.desc">{{ data.desc }}</p>
      </div>
    </div>
    <div v-if="data.steps" class="plan-steps">
      <div v-for="step in data.steps" :key="step" class="plan-step">{{ step }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

defineProps<{ data: any }>();
</script>

<style scoped>
.node-card {
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 220px;
}
.node-card.planner {
  border: 2px solid #2563eb;
  background: rgba(219, 234, 254, 0.5);
}
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon { padding: 6px; border-radius: 6px; }
.node-icon.planner-icon { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.node-header h3 {
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
  line-height: 1;
  margin: 0;
}
.node-header p {
  font-size: 11px;
  color: #64748b;
  margin: 3px 0 0;
}
.plan-steps {
  display: flex;
  gap: 8px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #bfdbfe;
  padding: 6px;
}
.plan-step {
  flex: 1;
  background: #f8fafc;
  padding: 6px;
  border-radius: 4px;
}
</style>