<template>
  <div :class="['node-card', data.color || '']">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div :class="['node-icon', data.color ? `${data.color}-icon` : '']"><el-icon><Cpu /></el-icon></div>
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
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
}
.node-card.indigo { border-color: #c7d2fe; background: rgba(238, 242, 255, 0.5); }
.node-card.emerald { border-color: #a7f3d0; background: rgba(209, 250, 229, 0.5); }
.node-card.amber { border-color: #fde68a; background: rgba(254, 243, 199, 0.5); }
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon {
  padding: 6px;
  border-radius: 6px;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.5);
  color: #475569;
}
.node-icon.indigo-icon { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }
.node-icon.emerald-icon { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.node-icon.amber-icon { background: #fffbeb; color: #d97706; border-color: #fde68a; }
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