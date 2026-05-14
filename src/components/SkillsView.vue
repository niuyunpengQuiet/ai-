<template>
  <div class="skills-view">
    <div class="skills-header">
      <div>
        <h2 class="view-title">插拔式 Skill 库</h2>
        <p class="view-subtitle">将外部 API、脚本或内部 Java SPI 封装为原子能力供智能体调用。</p>
      </div>
      <el-button type="primary" dark>
        <el-icon><Plus /></el-icon>
        注册 Skill
      </el-button>
    </div>

    <el-row :gutter="16">
      <el-col :span="12" v-for="skill in skillStore.skills" :key="skill.id">
        <div class="skill-card">
          <div class="skill-top">
            <div class="skill-identity">
              <div class="skill-icon">
                <el-icon :size="20"><SetUp /></el-icon>
              </div>
              <div>
                <h3>{{ skill.name }}</h3>
                <span class="skill-id">{{ skill.id }}</span>
              </div>
            </div>
            <span :class="['status-badge', skill.status === 'active' ? 'active' : 'warning']">
              {{ skill.status }}
            </span>
          </div>

          <div class="skill-meta">
            <div class="meta-item">
              <span class="meta-label">接入类型</span>
              <span class="meta-value">{{ skill.type }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">提供方 / API</span>
              <span class="meta-value">{{ skill.provider }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">鉴权方式</span>
              <span class="meta-value">{{ skill.auth }}</span>
            </div>
          </div>

          <div class="skill-action">
            <el-button text type="primary" size="small">配置鉴权参数 →</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useSkillStore } from '../stores/agent';

const skillStore = useSkillStore();
</script>

<style scoped>
.skills-view {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.skills-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.skill-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.skill-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.skill-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}
.skill-icon {
  padding: 8px;
  background: #f1f5f9;
  border-radius: 8px;
  color: #475569;
}
.skill-identity h3 {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin: 0;
}
.skill-id {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.skill-meta {
  padding-top: 16px;
  border-top: 1px dashed #f1f5f9;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  font-size: 12px;
}
.meta-label {
  display: block;
  color: #64748b;
  margin-bottom: 4px;
}
.meta-value {
  font-weight: 500;
  color: #1e293b;
}

.skill-action {
  margin-top: 8px;
}
</style>