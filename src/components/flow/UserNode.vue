<template>
  <div class="node-card user">
    <Handle type="source" :position="Position.Bottom" />
    <div class="node-header">
      <div class="node-icon user-icon"><el-icon><User /></el-icon></div>
      <div>
        <h3>{{ data.label }}</h3>
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
  min-width: 160px;
}
.node-card.user {
  border: 1px solid #cbd5e1;
  background: #fff;
}
.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-icon { padding: 6px; border-radius: 6px; }
.node-icon.user-icon { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.node-header h3 {
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
  line-height: 1;
  margin: 0;
}
</style>