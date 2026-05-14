<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <el-dropdown trigger="click" @command="brandStore.setBrand" @visible-change="brandStore.showBrandMenu = $event">
          <div class="brand-trigger">
            <div :class="['brand-mascot', brandStore.activeBrand.bgColor, brandStore.activeBrand.border]">
              <AnimIcon :name="brandStore.activeBrand.id" :size="22" :color="brandMascotColor(brandStore.activeBrand.id)" :fill="brandMascotFill(brandStore.activeBrand.id)" />
            </div>
            <div class="brand-info">
              <h1>{{ brandStore.activeBrand.name }}</h1>
              <p>{{ brandStore.activeBrand.desc }}</p>
            </div>
            <el-icon :class="{ 'rotate-icon': brandStore.showBrandMenu }"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="brand in brandStore.brands"
                :key="brand.id"
                :command="brand"
              >
                <div class="brand-option">
                  <div :class="['brand-mascot-sm', brand.bgColor, brand.border]">
                  <AnimIcon :name="brand.id" :size="16" :color="brandMascotColor(brand.id)" :fill="brandMascotFill(brand.id)" />
                </div>
                  <div>
                    <div class="brand-option-name">{{ brand.name }}</div>
                    <div class="brand-option-desc">{{ brand.desc }}</div>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-menu
        :default-active="appStore.activeView"
        class="sidebar-nav"
        @select="appStore.setActiveView"
      >
        <el-menu-item v-for="item in NAVIGATION" :key="item.id" :index="item.id">
          <AnimIcon :name="item.animIcon" :size="18" color="#475569" fill="#f8fafc" />
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-button text class="footer-btn" @click="">
          <AnimIcon name="setting" :size="16" color="#475569" fill="#f8fafc" />
          系统设置
        </el-button>
        <div class="footer-meta">
          <span>v2.4.1-rc</span>
          <span class="connection-status">
            <span class="status-dot"></span> Connected
          </span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div :class="['main-scroll', { 'full-width-scroll': appStore.activeView === 'architecture' || appStore.activeView === 'chat' }]" ref="mainScroll">
        <div class="main-inner" :class="{ 'full-width': appStore.activeView === 'architecture' || appStore.activeView === 'chat' }">
          <DashboardView v-if="appStore.activeView === 'dashboard'" />
          <ArchitectureView v-else-if="appStore.activeView === 'architecture'" />
          <AgentsView v-else-if="appStore.activeView === 'agents'" />
          <SkillsView v-else-if="appStore.activeView === 'skills'" />
          <KnowledgeView v-else-if="appStore.activeView === 'knowledge'" />
          <ChatView v-else-if="appStore.activeView === 'chat'" />
        </div>
      </div>

      <!-- Back to Top -->
      <transition name="fade">
        <div v-if="showBackTop" class="back-to-top" @click="scrollToTop">
          <el-icon :size="18"><Top /></el-icon>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Top } from '@element-plus/icons-vue';
import { NAVIGATION } from './constants';
import { useAppStore } from './stores/app';
import { useBrandStore } from './stores/brand';
import AnimIcon from './components/AnimIcon.vue';
import DashboardView from './components/DashboardView.vue';
import ArchitectureView from './components/ArchitectureView.vue';
import AgentsView from './components/AgentsView.vue';
import SkillsView from './components/SkillsView.vue';
import KnowledgeView from './components/KnowledgeView.vue';
import ChatView from './components/ChatView.vue';

const appStore = useAppStore();
const brandStore = useBrandStore();

const mainScroll = ref<HTMLElement | null>(null);
const showBackTop = ref(false);

function brandMascotColor(id: string) {
  const map: Record<string, string> = { ruijian: '#2563eb', haidun: '#059669', zhishu: '#4f46e5', ruitong: '#d97706' };
  return map[id] || '#4f46e5';
}
function brandMascotFill(id: string) {
  const map: Record<string, string> = { ruijian: '#dbeafe', haidun: '#d1fae5', zhishu: '#e0e7ff', ruitong: '#fef3c7' };
  return map[id] || '#eef2ff';
}

function handleScroll() {
  if (mainScroll.value) {
    showBackTop.value = mainScroll.value.scrollTop > 200;
  }
}

function scrollToTop() {
  if (mainScroll.value) {
    mainScroll.value.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

onMounted(() => {
  mainScroll.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  mainScroll.value?.removeEventListener('scroll', handleScroll);
});

watch(() => appStore.activeView, () => {
  scrollToTop();
});
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f8fafc;
  color: #1e293b;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

.sidebar {
  width: 256px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
}

.sidebar-brand {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.brand-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: -8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.brand-trigger:hover {
  background: #f8fafc;
}

.brand-mascot {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid;
  flex-shrink: 0;
}
.brand-mascot.bg-blue-100 { background: #dbeafe; border-color: #bfdbfe; }
.brand-mascot.bg-emerald-100 { background: #d1fae5; border-color: #a7f3d0; }
.brand-mascot.bg-indigo-100 { background: #e0e7ff; border-color: #c7d2fe; }
.brand-mascot.bg-amber-100 { background: #fef3c7; border-color: #fde68a; }
.brand-mascot.border-blue-200 { border-color: #bfdbfe; }
.brand-mascot.border-emerald-200 { border-color: #a7f3d0; }
.brand-mascot.border-indigo-200 { border-color: #c7d2fe; }
.brand-mascot.border-amber-200 { border-color: #fde68a; }

.brand-info {
  text-align: left;
  margin-left: 12px;
  flex: 1;
}
.brand-info h1 {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1e293b;
  margin: 0;
}
.brand-info p {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 128px;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.brand-option {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-mascot-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid;
  flex-shrink: 0;
}
.brand-option-name {
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
}
.brand-option-desc {
  font-size: 10px;
  color: #64748b;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  border-right: none;
}
.sidebar-nav .el-menu-item {
  border-radius: 6px;
  margin-bottom: 4px;
  height: 40px;
  line-height: 40px;
}
.sidebar-nav .el-menu-item.is-active {
  background: #eef2ff;
  color: #4338ca;
}
.sidebar-nav .el-menu-item.is-active .el-icon {
  color: #4f46e5;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}
.footer-btn {
  width: 100%;
  justify-content: flex-start;
  gap: 12px;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}
.footer-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 11px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 4px;
}
.connection-status {
  display: flex;
  align-items: center;
  gap: 4px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #f8fafc;
  position: relative;
}
.main-scroll {
  height: 100%;
  overflow-y: auto;
  width: 100%;
  padding: 32px;
}
.main-scroll.full-width-scroll {
  padding: 16px;
  height: 100%;
}
.main-inner {
  max-width: 1152px;
  margin: 0 auto;
  width: 100%;
}
.main-inner.full-width {
  max-width: 100%;
  height: 100%;
}

.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: all 0.2s;
  z-index: 100;
}
.back-to-top:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
