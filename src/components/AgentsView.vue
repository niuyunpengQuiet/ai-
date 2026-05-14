<template>
  <div class="agents-view">
    <div class="agents-header">
      <div>
        <h2 class="view-title">智能体配置 (Agent Profiles)</h2>
        <p class="view-subtitle">定义调度系统中的核心智能体角色，绑定技能与业务知识库。</p>
      </div>
      <el-button type="primary" @click="handleCreate" dark>
        <el-icon><Plus /></el-icon>
        新建智能体配置
      </el-button>
    </div>

    <el-table :data="agentStore.agents" style="width: 100%;" stripe>
      <el-table-column label="基本信息" min-width="220">
        <template #default="{ row }">
          <div class="agent-info">
            <div class="agent-avatar">
              <el-icon :size="20"><Service /></el-icon>
            </div>
            <div>
              <div class="agent-name">{{ row.name }}</div>
              <div class="agent-id">{{ row.id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="模型驱动" min-width="160">
        <template #default="{ row }">
          <div class="model-info">
            <span class="model-name">
              <el-icon :size="14"><Monitor /></el-icon>
              {{ row.model }}
            </span>
            <span class="model-temp">Temp: {{ row.temperature }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="编排策略设定" min-width="180">
        <template #default="{ row }">
          <div class="strategy-info">
            <div class="strategy-row">
              <span class="strategy-label">Max Steps :</span>
              <span class="strategy-value">{{ row.maxSteps }}</span>
            </div>
            <div class="strategy-row">
              <span class="strategy-label">降级策略  :</span>
              <el-tag v-if="row.fallback" size="small" type="info" effect="plain" style="font-family: monospace; font-size: 10px;">{{ row.fallback }}</el-tag>
              <span v-else class="no-fallback">无 (终止)</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="挂载依赖 (Skills / KB)" min-width="200">
        <template #default="{ row }">
          <div class="deps-tags">
            <el-tag v-for="s in row.skills" :key="s" size="small" effect="plain" type="" style="background: #eef2ff; color: #4338ca; border-color: #c7d2fe; margin: 2px;">{{ s }}</el-tag>
            <el-tag v-for="k in row.knowledge" :key="k" size="small" effect="plain" type="warning" style="margin: 2px;">{{ k }}</el-tag>
            <span v-if="row.skills.length === 0 && row.knowledge.length === 0" class="no-deps">None</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="管理操作" width="120" align="right">
        <template #default="{ row }">
          <el-button text @click="handleEdit(row)">
            <el-icon><Setting /></el-icon>
          </el-button>
          <el-button text type="danger" @click="handleDelete(row.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="showDialog"
      :title="editingAgent === 'new' ? '创建新智能体' : '编辑智能体配置'"
      width="600px"
      destroy-on-close
    >
      <el-form label-position="top" class="agent-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="智能体名称">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="逻辑角色 (Role)">
              <el-select v-model="formData.role" style="width: 100%;">
                <el-option label="专家 Worker" value="Worker" />
                <el-option label="路由 Router" value="Router" />
                <el-option label="主管 Supervisor" value="Supervisor" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="底层模型">
              <el-input v-model="formData.model" style="font-family: 'JetBrains Mono', monospace;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="随机度 (Temp)">
              <el-input-number v-model="formData.temperature" :step="0.1" :min="0" :max="2" :precision="1" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大步数 (Max Steps)">
              <el-input-number v-model="formData.maxSteps" :min="1" :max="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="关联技能池 (Skills)">
          <el-checkbox-group v-model="formData.selectedSkills">
            <el-checkbox v-for="skill in skillStore.skills" :key="skill.id" :label="skill.id" :value="skill.id">
              {{ skill.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="挂载知识库 (RAG Knowledge Bases)">
          <el-checkbox-group v-model="formData.selectedKb">
            <el-checkbox v-for="kb in knowledgeStore.knowledgeBases" :key="kb.id" :label="kb.id" :value="kb.id">
              {{ kb.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="降级策略 (Fallback Target)">
          <el-select v-model="formData.fallback" clearable placeholder="（无 / 直接终止）" style="width: 100%;">
            <el-option v-for="a in agentStore.agents" :key="a.id" :label="`${a.name} (${a.id})`" :value="a.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存智能体配置
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAgentStore, useSkillStore, useKnowledgeStore } from '../stores/agent';
import { ElMessageBox } from 'element-plus';

const agentStore = useAgentStore();
const skillStore = useSkillStore();
const knowledgeStore = useKnowledgeStore();

const showDialog = ref(false);
const editingAgent = ref<string | null>(null);
const formData = reactive<any>({});

function handleEdit(agent: any) {
  Object.assign(formData, {
    ...agent,
    selectedSkills: [...agent.skills],
    selectedKb: [...agent.knowledge],
  });
  editingAgent.value = agent.id;
  showDialog.value = true;
}

function handleCreate() {
  Object.assign(formData, {
    id: `agt-custom-${Math.random().toString(36).substr(2, 4)}`,
    name: '自定义专属专家',
    role: 'Worker',
    model: 'gpt-4o',
    temperature: 0.5,
    maxSteps: 5,
    fallback: 'agt-router',
    selectedSkills: [],
    selectedKb: [],
  });
  editingAgent.value = 'new';
  showDialog.value = true;
}

function handleDelete(id: string) {
  ElMessageBox.confirm('确认删除该智能体配置？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    agentStore.removeAgent(id);
  }).catch(() => {});
}

function handleSave() {
  const updatedAgent = {
    ...formData,
    temperature: parseFloat(formData.temperature),
    maxSteps: parseInt(formData.maxSteps, 10),
    skills: [...formData.selectedSkills],
    knowledge: [...formData.selectedKb],
  };
  delete updatedAgent.selectedSkills;
  delete updatedAgent.selectedKb;

  if (editingAgent.value === 'new') {
    agentStore.addAgent(updatedAgent);
  } else {
    agentStore.updateAgent(editingAgent.value!, updatedAgent);
  }
  showDialog.value = false;
}
</script>

<style scoped>
.agents-view {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.agents-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}
.agent-name {
  font-weight: 500;
  color: #1e293b;
}
.agent-id {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  margin-top: 2px;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.model-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: #334155;
  font-size: 13px;
}
.model-temp {
  font-size: 12px;
  color: #64748b;
}

.strategy-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}
.strategy-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.strategy-label {
  width: 80px;
  color: #64748b;
}
.strategy-value {
  font-weight: 500;
  color: #1e293b;
}
.no-fallback {
  font-size: 10px;
  color: #94a3b8;
}

.deps-tags {
  display: flex;
  flex-wrap: wrap;
  max-width: 200px;
}
.no-deps {
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
}

.agent-form :deep(.el-form-item__label) {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
}
</style>