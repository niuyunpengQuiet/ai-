<template>
  <div class="node-card router">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon router-icon"><el-icon><Share /></el-icon></div>
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
.node-card.router {
  border: 2px solid #7c3aed;
  background: rgba(245, 243, 255, 0.5);
}
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon {
  padding: 6px;
  border-radius: 6px;
}
.node-icon.router-icon { background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe; }
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