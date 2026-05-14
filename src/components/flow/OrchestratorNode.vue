<template>
  <div class="node-card purple">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon purple-icon"><el-icon><Share /></el-icon></div>
      <div>
        <h3>{{ data.label }}</h3>
        <p v-if="data.desc">{{ data.desc }}</p>
      </div>
    </div>
    <div v-if="data.subItems" class="node-children">
      <div v-for="item in data.subItems" :key="item" class="node-child purple-child">
        {{ item }} <el-icon><Right /></el-icon>
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
  min-width: 200px;
}
.node-card.purple {
  border-color: #c4b5fd;
  background: rgba(245, 243, 255, 0.5);
  box-shadow: 0 0 0 4px #fff;
}
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
.node-icon.purple-icon { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
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
.node-children {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 11px;
}
.node-child {
  background: #fff;
  padding: 6px 10px;
  border: 1px solid #ddd6fe;
  border-radius: 4px;
  color: #6d28d9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>