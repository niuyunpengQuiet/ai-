<template>
  <div class="node-card tool">
    <Handle type="source" :position="Position.Top" />
    <Handle type="target" :position="Position.Bottom" />
    <div class="node-header">
      <div class="node-icon tool-icon"><el-icon><Box /></el-icon></div>
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
.node-card.tool {
  border: 1px solid #94a3b8;
  background: #f1f5f9;
}
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon { padding: 6px; border-radius: 6px; }
.node-icon.tool-icon { background: #e2e8f0; color: #475569; border: 1px solid #cbd5e1; }
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