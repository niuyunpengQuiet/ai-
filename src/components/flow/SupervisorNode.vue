<template>
  <div :class="['node-card', data.color ? `sup-${data.color}` : 'sup-dark']">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div :class="['node-icon', data.color ? `sup-${data.color}-icon` : 'sup-dark-icon']"><el-icon><OfficeBuilding /></el-icon></div>
      <div>
        <h3>{{ data.label }}</h3>
        <p v-if="data.desc">{{ data.desc }}</p>
      </div>
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
  min-width: 180px;
}
.node-card.sup-dark { border: 2px solid #1e293b; background: #f8fafc; }
.node-card.sup-indigo { border: 2px solid #4f46e5; background: rgba(238, 242, 255, 0.5); }
.node-card.sup-amber { border: 2px solid #d97706; background: rgba(254, 243, 199, 0.5); }
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon { padding: 6px; border-radius: 6px; }
.node-icon.sup-dark-icon { background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; }
.node-icon.sup-indigo-icon { background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; }
.node-icon.sup-amber-icon { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
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
</style>