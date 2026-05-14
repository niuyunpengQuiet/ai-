<template>
  <svg
    :viewBox="viewBox"
    :width="size"
    :height="size"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 睿鉴: 鹰眼扫描 -->
    <template v-if="name === 'ruijian'">
      <circle cx="16" cy="16" r="12" :stroke="color" stroke-width="1.5" class="anim-rotate-slow" />
      <circle cx="16" cy="16" r="6" :stroke="color" stroke-width="1.5" fill="none" />
      <circle cx="16" cy="16" r="2" :fill="color" class="anim-pulse" />
      <line x1="16" y1="2" x2="16" y2="6" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-scan" />
      <line x1="16" y1="26" x2="16" y2="30" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-scan" />
      <line x1="2" y1="16" x2="6" y2="16" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-scan" />
      <line x1="26" y1="16" x2="30" y2="16" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-scan" />
    </template>

    <!-- 海盾: 盾牌脉冲 -->
    <template v-else-if="name === 'haidun'">
      <path d="M16 3 L28 9 V17 C28 24 22 29 16 31 C10 29 4 24 4 17 V9 Z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-shield-pulse" />
      <path d="M16 10 L16 18 M12 14 L20 14" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-draw" />
      <circle cx="16" cy="20" r="3" :stroke="color" stroke-width="1" fill="none" class="anim-ripple" />
    </template>

    <!-- 智枢: 章鱼触手 -->
    <template v-else-if="name === 'zhishu'">
      <circle cx="16" cy="12" r="6" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <circle cx="14" cy="11" r="1" :fill="color" class="anim-blink" />
      <circle cx="18" cy="11" r="1" :fill="color" class="anim-blink-delay" />
      <path d="M10 17 Q8 22 6 26" :stroke="color" stroke-width="1.5" stroke-linecap="round" fill="none" class="anim-tentacle-1" />
      <path d="M13 18 Q12 23 10 28" :stroke="color" stroke-width="1.5" stroke-linecap="round" fill="none" class="anim-tentacle-2" />
      <path d="M19 18 Q20 23 22 28" :stroke="color" stroke-width="1.5" stroke-linecap="round" fill="none" class="anim-tentacle-3" />
      <path d="M22 17 Q24 22 26 26" :stroke="color" stroke-width="1.5" stroke-linecap="round" fill="none" class="anim-tentacle-4" />
    </template>

    <!-- 睿瞳: 天眼扫视 -->
    <template v-else-if="name === 'ruitong'">
      <ellipse cx="16" cy="16" rx="12" ry="8" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-eye-blink" />
      <circle cx="16" cy="16" r="4" :fill="color" class="anim-pupil" />
      <circle cx="15" cy="15" r="1.5" fill="#fff" opacity="0.8" />
      <path d="M4 16 Q8 10 16 8 Q24 10 28 16" :stroke="color" stroke-width="1" fill="none" opacity="0.3" class="anim-scan-line" />
    </template>

    <!-- Dashboard: 监控面板 -->
    <template v-else-if="name === 'dashboard'">
      <rect x="3" y="3" width="26" height="26" rx="4" :stroke="color" stroke-width="1.5" :fill="fill" />
      <rect x="6" y="6" width="8" height="8" rx="2" :fill="color" opacity="0.3" class="anim-blink" />
      <rect x="18" y="6" width="8" height="4" rx="1" :fill="color" opacity="0.2" class="anim-bar-1" />
      <rect x="18" y="13" width="8" height="4" rx="1" :fill="color" opacity="0.15" class="anim-bar-2" />
      <rect x="6" y="18" width="20" height="8" rx="2" :fill="color" opacity="0.1" class="anim-wave" />
    </template>

    <!-- Architecture: 编排拓扑 -->
    <template v-else-if="name === 'architecture'">
      <circle cx="16" cy="8" r="4" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <circle cx="6" cy="24" r="3" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink-delay" />
      <circle cx="16" cy="24" r="3" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink" />
      <circle cx="26" cy="24" r="3" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink-delay" />
      <line x1="16" y1="12" x2="6" y2="21" :stroke="color" stroke-width="1" class="anim-draw" />
      <line x1="16" y1="12" x2="16" y2="21" :stroke="color" stroke-width="1" class="anim-draw" />
      <line x1="16" y1="12" x2="26" y2="21" :stroke="color" stroke-width="1" class="anim-draw" />
    </template>

    <!-- Agent: 智能体 -->
    <template v-else-if="name === 'agent'">
      <circle cx="16" cy="10" r="5" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <path d="M7 27c0-5 4-9 9-9s9 4 9 9" :stroke="color" stroke-width="1.5" fill="none" stroke-linecap="round" class="anim-draw" />
      <circle cx="24" cy="8" r="3" :fill="color" opacity="0.3" class="anim-blink" />
    </template>

    <!-- Skill: 技能插件 -->
    <template v-else-if="name === 'skill'">
      <rect x="6" y="6" width="20" height="20" rx="4" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-rotate-center" />
      <path d="M13 16h6M16 13v6" :stroke="color" stroke-width="2" stroke-linecap="round" />
      <circle cx="8" cy="8" r="2" :fill="color" opacity="0.3" class="anim-blink" />
      <circle cx="24" cy="24" r="2" :fill="color" opacity="0.3" class="anim-blink-delay" />
    </template>

    <!-- Knowledge: 知识库 -->
    <template v-else-if="name === 'knowledge'">
      <path d="M4 8l12-4 12 4v14l-12 6-12-6z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <path d="M4 8l12 6M28 8l-12 6v16" :stroke="color" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="16" cy="14" r="2" :fill="color" class="anim-pulse" />
    </template>

    <!-- Chat: 对话 -->
    <template v-else-if="name === 'chat'">
      <path d="M4 6h18a2 2 0 012 2v10a2 2 0 01-2 2H10l-6 5v-5H4a2 2 0 01-2-2V8a2 2 0 012-2z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <circle cx="9" cy="13" r="1" :fill="color" class="anim-typing-1" />
      <circle cx="13" cy="13" r="1" :fill="color" class="anim-typing-2" />
      <circle cx="17" cy="13" r="1" :fill="color" class="anim-typing-3" />
      <path d="M20 14h6a2 2 0 012 2v8a2 2 0 01-2 2h-1v4l-4-4h-1" :stroke="color" stroke-width="1.5" fill="none" class="anim-draw" />
    </template>

    <!-- Setting: 设置齿轮 -->
    <template v-else-if="name === 'setting'">
      <circle cx="16" cy="16" r="6" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-rotate-center" />
      <circle cx="16" cy="16" r="2.5" :fill="color" />
      <line x1="16" y1="2" x2="16" y2="6" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="16" y1="26" x2="16" y2="30" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="2" y1="16" x2="6" y2="16" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="26" y1="16" x2="30" y2="16" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="6" y1="6" x2="9" y2="9" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="23" y1="23" x2="26" y2="26" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="6" y1="26" x2="9" y2="23" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
      <line x1="23" y1="9" x2="26" y2="6" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-rotate-center" />
    </template>

    <!-- Plus: 新增 -->
    <template v-else-if="name === 'plus'">
      <circle cx="16" cy="16" r="12" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <line x1="16" y1="10" x2="16" y2="22" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-draw" />
      <line x1="10" y1="16" x2="22" y2="16" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-draw" />
    </template>

    <!-- Upload: 上传 -->
    <template v-else-if="name === 'upload'">
      <rect x="4" y="18" width="24" height="10" rx="3" :stroke="color" stroke-width="1.5" :fill="fill" />
      <path d="M16 18V6M11 11l5-5 5 5" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="anim-float" />
    </template>

    <!-- Search: 搜索 -->
    <template v-else-if="name === 'search'">
      <circle cx="14" cy="14" r="8" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <line x1="20" y1="20" x2="28" y2="28" :stroke="color" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Warning: 警告 -->
    <template v-else-if="name === 'warning'">
      <path d="M16 4L2 28h28L16 4z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <line x1="16" y1="12" x2="16" y2="19" :stroke="color" stroke-width="2" stroke-linecap="round" class="anim-blink" />
      <circle cx="16" cy="23" r="1.5" :fill="color" class="anim-blink" />
    </template>

    <!-- Edit: 编辑 -->
    <template v-else-if="name === 'edit'">
      <path d="M4 24v4h4L26 10l-4-4L4 24z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-draw" />
      <path d="M22 6l4 4" :stroke="color" stroke-width="1.5" stroke-linecap="round" />
    </template>

    <!-- Delete: 删除 -->
    <template v-else-if="name === 'delete'">
      <rect x="4" y="8" width="24" height="20" rx="3" :stroke="color" stroke-width="1.5" :fill="fill" />
      <line x1="2" y1="8" x2="30" y2="8" :stroke="color" stroke-width="1.5" stroke-linecap="round" />
      <path d="M10 4h12" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-draw" />
      <line x1="12" y1="14" x2="12" y2="22" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-blink" />
      <line x1="16" y1="14" x2="16" y2="22" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-blink-delay" />
      <line x1="20" y1="14" x2="20" y2="22" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-blink" />
    </template>

    <!-- Check: 确认 -->
    <template v-else-if="name === 'check'">
      <circle cx="16" cy="16" r="12" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <path d="M10 16l4 4 8-8" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="anim-draw" />
    </template>

    <!-- Save: 保存 -->
    <template v-else-if="name === 'save'">
      <rect x="4" y="4" width="24" height="24" rx="3" :stroke="color" stroke-width="1.5" :fill="fill" />
      <rect x="8" y="4" width="16" height="8" rx="1" :stroke="color" stroke-width="1" :fill="fill" class="anim-blink" />
      <rect x="8" y="18" width="16" height="10" rx="2" :stroke="color" stroke-width="1" :fill="fill" class="anim-draw" />
    </template>

    <!-- Grid: 网格 -->
    <template v-else-if="name === 'grid'">
      <rect x="4" y="4" width="10" height="10" rx="2" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink" />
      <rect x="18" y="4" width="10" height="10" rx="2" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink-delay" />
      <rect x="4" y="18" width="10" height="10" rx="2" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink-delay" />
      <rect x="18" y="18" width="10" height="10" rx="2" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-blink" />
    </template>

    <!-- Coin: 数据库 -->
    <template v-else-if="name === 'coin'">
      <ellipse cx="16" cy="8" rx="10" ry="4" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <path d="M6 8v16c0 2.2 4.5 4 10 4s10-1.8 10-4V8" :stroke="color" stroke-width="1.5" />
      <ellipse cx="16" cy="16" rx="10" ry="4" :stroke="color" stroke-width="1" opacity="0.3" class="anim-pulse" />
    </template>

    <!-- List: 列表 -->
    <template v-else-if="name === 'list'">
      <line x1="10" y1="8" x2="26" y2="8" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-draw" />
      <line x1="10" y1="16" x2="26" y2="16" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-draw" />
      <line x1="10" y1="24" x2="26" y2="24" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-draw" />
      <circle cx="6" cy="8" r="2" :fill="color" class="anim-blink" />
      <circle cx="6" cy="16" r="2" :fill="color" class="anim-blink-delay" />
      <circle cx="6" cy="24" r="2" :fill="color" class="anim-blink" />
    </template>

    <!-- Document: 文档 -->
    <template v-else-if="name === 'document'">
      <path d="M8 2h10l8 8v18a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <path d="M18 2v8h8" :stroke="color" stroke-width="1.5" stroke-linecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" :stroke="color" stroke-width="1" stroke-linecap="round" class="anim-draw" />
      <line x1="10" y1="20" x2="18" y2="20" :stroke="color" stroke-width="1" stroke-linecap="round" class="anim-draw" />
    </template>

    <!-- SetUp: 插件 -->
    <template v-else-if="name === 'setup'">
      <rect x="4" y="4" width="24" height="24" rx="6" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-rotate-center" />
      <circle cx="16" cy="16" r="4" :stroke="color" stroke-width="1.5" fill="none" class="anim-pulse" />
      <circle cx="16" cy="16" r="1.5" :fill="color" />
    </template>

    <!-- Service: 服务 -->
    <template v-else-if="name === 'service'">
      <circle cx="16" cy="10" r="5" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <path d="M7 27c0-5 4-9 9-9s9 4 9 9" :stroke="color" stroke-width="1.5" fill="none" stroke-linecap="round" class="anim-draw" />
      <circle cx="24" cy="8" r="3" :fill="color" opacity="0.3" class="anim-blink" />
    </template>

    <!-- Monitor: 显示器 -->
    <template v-else-if="name === 'monitor'">
      <rect x="3" y="4" width="26" height="18" rx="3" :stroke="color" stroke-width="1.5" :fill="fill" />
      <line x1="12" y1="26" x2="20" y2="26" :stroke="color" stroke-width="1.5" stroke-linecap="round" class="anim-draw" />
      <line x1="16" y1="22" x2="16" y2="26" :stroke="color" stroke-width="1.5" />
      <rect x="6" y="7" width="6" height="6" rx="1" :fill="color" opacity="0.2" class="anim-blink" />
      <rect x="14" y="7" width="12" height="3" rx="1" :fill="color" opacity="0.15" class="anim-bar-1" />
      <rect x="14" y="12" width="8" height="3" rx="1" :fill="color" opacity="0.1" class="anim-bar-2" />
    </template>

    <!-- User: 用户 -->
    <template v-else-if="name === 'user'">
      <circle cx="16" cy="10" r="5" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
      <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" :stroke="color" stroke-width="1.5" fill="none" stroke-linecap="round" class="anim-draw" />
    </template>

    <!-- OfficeBuilding: 建筑 -->
    <template v-else-if="name === 'building'">
      <rect x="4" y="4" width="24" height="24" rx="2" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-float" />
      <rect x="8" y="8" width="4" height="4" rx="1" :fill="color" opacity="0.3" class="anim-blink" />
      <rect x="14" y="8" width="4" height="4" rx="1" :fill="color" opacity="0.3" class="anim-blink-delay" />
      <rect x="20" y="8" width="4" height="4" rx="1" :fill="color" opacity="0.3" class="anim-blink" />
      <rect x="8" y="16" width="4" height="4" rx="1" :fill="color" opacity="0.3" class="anim-blink-delay" />
      <rect x="14" y="16" width="4" height="4" rx="1" :fill="color" opacity="0.3" class="anim-blink" />
      <rect x="12" y="24" width="8" height="4" rx="1" :fill="color" opacity="0.5" class="anim-draw" />
    </template>

    <!-- Right: 箭头 -->
    <template v-else-if="name === 'right'">
      <path d="M12 6l10 10-10 10" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="anim-draw" />
    </template>

    <!-- Fallback: simple circle -->
    <template v-else>
      <circle cx="16" cy="16" r="12" :stroke="color" stroke-width="1.5" :fill="fill" class="anim-pulse" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  viewBox?: string;
}>();
</script>

<style>
/* All animation keyframes — global so scoped children can use them */
@keyframes animPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
}
@keyframes animBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.15; }
}
@keyframes animDraw {
  0% { stroke-dashoffset: 30; }
  100% { stroke-dashoffset: 0; }
}
@keyframes animRotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes animFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes animScan {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes animShieldPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
@keyframes animRipple {
  0% { r: 3; opacity: 0.8; }
  100% { r: 8; opacity: 0; }
}
@keyframes animTentacle1 {
  0%, 100% { d: path("M10 17 Q8 22 6 26"); }
  50% { d: path("M10 17 Q7 21 5 25"); }
}
@keyframes animTentacle2 {
  0%, 100% { d: path("M13 18 Q12 23 10 28"); }
  50% { d: path("M13 18 Q11 22 9 27"); }
}
@keyframes animTentacle3 {
  0%, 100% { d: path("M19 18 Q20 23 22 28"); }
  50% { d: path("M19 18 Q21 22 23 27"); }
}
@keyframes animTentacle4 {
  0%, 100% { d: path("M22 17 Q24 22 26 26"); }
  50% { d: path("M22 17 Q25 21 27 25"); }
}
@keyframes animEyeBlink {
  0%, 42%, 58%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}
@keyframes animPupil {
  0%, 100% { cx: 16; }
  25% { cx: 18; }
  75% { cx: 14; }
}
@keyframes animScanLine {
  0% { d: path("M4 16 Q8 10 16 8 Q24 10 28 16"); opacity: 0.3; }
  50% { d: path("M4 16 Q8 22 16 24 Q24 22 28 16"); opacity: 0.6; }
  100% { d: path("M4 16 Q8 10 16 8 Q24 10 28 16"); opacity: 0.3; }
}
@keyframes animTyping1 {
  0%, 100% { cy: 13; }
  50% { cy: 11; }
}
@keyframes animTyping2 {
  0%, 100% { cy: 13; }
  33% { cy: 11; }
}
@keyframes animTyping3 {
  0%, 100% { cy: 13; }
  66% { cy: 11; }
}
@keyframes animBar1 {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(0.7); opacity: 0.7; }
}
@keyframes animBar2 {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(0.7); opacity: 0.7; }
}
@keyframes animWave {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

.anim-pulse { animation: animPulse 2s ease-in-out infinite; transform-origin: center; }
.anim-blink { animation: animBlink 2s ease-in-out infinite; }
.anim-blink-delay { animation: animBlink 2s ease-in-out 0.5s infinite; }
.anim-draw { stroke-dasharray: 30; animation: animDraw 2s ease-in-out infinite alternate; }
.anim-rotate-slow { animation: animRotateSlow 8s linear infinite; transform-origin: center; }
.anim-rotate-center { animation: animRotateSlow 6s linear infinite; transform-origin: 16px 16px; }
.anim-float { animation: animFloat 3s ease-in-out infinite; }
.anim-scan { animation: animScan 2s ease-in-out infinite; }
.anim-shield-pulse { animation: animShieldPulse 2.5s ease-in-out infinite; transform-origin: center; }
.anim-ripple { animation: animRipple 2s ease-out infinite; }
.anim-tentacle-1 { animation: animTentacle1 2s ease-in-out infinite; }
.anim-tentacle-2 { animation: animTentacle2 2s ease-in-out 0.3s infinite; }
.anim-tentacle-3 { animation: animTentacle3 2s ease-in-out 0.6s infinite; }
.anim-tentacle-4 { animation: animTentacle4 2s ease-in-out 0.9s infinite; }
.anim-eye-blink { animation: animEyeBlink 4s ease-in-out infinite; transform-origin: center; }
.anim-pupil { animation: animPupil 4s ease-in-out infinite; }
.anim-scan-line { animation: animScanLine 3s ease-in-out infinite; }
.anim-typing-1 { animation: animTyping1 1.2s ease-in-out infinite; }
.anim-typing-2 { animation: animTyping2 1.2s ease-in-out 0.2s infinite; }
.anim-typing-3 { animation: animTyping3 1.2s ease-in-out 0.4s infinite; }
.anim-bar-1 { animation: animBar1 1.5s ease-in-out infinite; }
.anim-bar-2 { animation: animBar2 1.5s ease-in-out 0.15s infinite; }
.anim-wave { animation: animWave 2s ease-in-out infinite; }
</style>