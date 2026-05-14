<template>
  <BaseEdge :path="path" :style="edgeStyle" />
  <EdgeLabelRenderer>
    <div
      :style="labelStyle"
      class="nodrag nopan edge-label"
    >
      {{ data?.label }}
    </div>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core';

const props = defineProps<{
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  data: any;
  markerEnd: string;
  style: any;
}>();

const path = computed(() => {
  const [edgePath] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });
  return edgePath;
});

const edgeStyle = computed(() => ({
  stroke: '#cbd5e1',
  strokeWidth: 1.5,
  ...props.style,
}));

const labelStyle = computed(() => ({
  position: 'absolute' as const,
  transform: `translate(-50%, -50%) translate(${(props.sourceX + props.targetX) / 2}px,${(props.sourceY + props.targetY) / 2}px)`,
}));

</script>

<style scoped>
.edge-label {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #f1f5f9;
  pointer-events: all;
}
</style>