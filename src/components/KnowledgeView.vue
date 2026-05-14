<template>
  <div class="knowledge-view">
    <div class="kb-header">
      <div>
        <h2 class="view-title">知识库治理 (RAG Vector DB)</h2>
        <p class="view-subtitle">管理涉黑案事件、暗语词典等图文案卷的检索策略与模型权限。</p>
      </div>
      <div class="kb-actions">
        <el-button>
          <el-icon><Upload /></el-icon>
          批量导入语料
        </el-button>
        <el-button type="primary" dark @click="openEditor('new')">
          <el-icon><Plus /></el-icon>
          可视化新建知识库
        </el-button>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="12" v-for="kb in knowledgeStore.knowledgeBases" :key="kb.id">
        <div class="kb-card">
          <div class="kb-top">
            <div class="kb-identity">
              <div class="kb-icon">
                <el-icon :size="20"><Reading /></el-icon>
              </div>
              <div>
                <h3>{{ kb.name }}</h3>
                <div class="kb-badges">
                  <span class="type-tag">{{ kb.id }}</span>
                  <span v-if="kb.status === 'active'" class="status-badge active">
                    <span class="status-dot-inline"></span>就绪
                  </span>
                  <span v-else class="status-badge syncing">
                    <span class="status-dot-inline pulse-dot"></span>向量化中
                  </span>
                </div>
              </div>
            </div>
            <el-button text class="edit-btn" @click="openEditor(kb)">
              <el-icon><Grid /></el-icon>
            </el-button>
          </div>

          <div class="kb-meta">
            <div>
              <div class="meta-label">Embedding 引擎</div>
              <div class="meta-value mono">{{ kb.embeddingModel }}</div>
            </div>
            <div>
              <div class="meta-label">向量后端</div>
              <div class="meta-value">
                <el-icon :size="14" style="color: #94a3b8; margin-right: 4px;"><Coin /></el-icon>
                {{ kb.vectorDb }}
              </div>
            </div>
          </div>

          <div class="kb-footer">
            <div class="kb-docs">
              <el-icon :size="14"><Search /></el-icon>
              <span class="type-tag">{{ kb.docs.toLocaleString() }}</span>
              <span>个文档切片</span>
            </div>
            <div v-if="kb.id.includes('internal')" class="kb-restricted">
              <el-icon :size="12"><WarningFilled /></el-icon>
              高密级阻断
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Guide -->
    <div class="kb-guide">
      <h4>编排指南：动态注入上下文</h4>
      <p>
        知识库独立于智能体运行。编排层 (Orchestrator) 会在运行时将「本轮可用的私有检索列表」动态注入到目标请求中。若检索准确度不足、响应超时或模型置信度较低，系统中配置的降级策略 (<code>fallbackAgentId</code>) 会自动接管会话，从而避免在司法审判等关键环节中产生幻觉风险。
      </p>
    </div>

    <!-- Editor Drawer -->
    <el-drawer
      v-model="showEditor"
      title="可视化知识构建与编辑"
      direction="rtl"
      size="80%"
    >
      <template #header>
        <div class="drawer-header">
          <h3>
            <el-icon style="color: #4f46e5; margin-right: 8px;"><Grid /></el-icon>
            可视化知识构建与编辑
          </h3>
          <p>选择标准化模板结构，快速录入并向量化领域知识。</p>
        </div>
      </template>

      <div class="editor-layout">
        <!-- Left Templates -->
        <div class="template-sidebar">
          <label class="template-label">数据切片模板</label>
          <div
            v-for="t in TEMPLATES"
            :key="t.id"
            :class="['template-btn', { active: selectedTemplate === t.id }]"
            @click="selectedTemplate = t.id"
          >
            <div class="template-name">
              <el-icon :size="16" :color="selectedTemplate === t.id ? '#4f46e5' : '#94a3b8'"><component :is="t.icon" /></el-icon>
              {{ t.name }}
            </div>
            <div class="template-desc">{{ t.desc }}</div>
          </div>
        </div>

        <!-- Right Editor -->
        <div class="editor-main">
          <div class="editor-inner">
            <!-- Meta -->
            <div class="view-card" style="margin-bottom: 24px;">
              <el-form label-position="top">
                <el-form-item label="知识集名称">
                  <el-input v-model="editingKb.name" placeholder="例如：涉毒黑话1000条" />
                </el-form-item>
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="向量模型">
                      <el-select v-model="editingKb.embeddingModel" style="width: 100%;">
                        <el-option label="bge-m3-legal (司法专精)" value="bge-m3-legal" />
                        <el-option label="text-embedding-3-small" value="text-embedding-3-small" />
                        <el-option label="bge-m3-finance (经侦专精)" value="bge-m3-finance" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="向量后端 (Vector DB)">
                      <el-select style="width: 100%;">
                        <el-option label="纯向量检索: Milvus" />
                        <el-option label="纯向量检索: Qdrant" />
                        <el-option label="纯向量检索: Weaviate" />
                        <el-option label="纯向量检索: FAISS" />
                        <el-option label="混合检索: Milvus + Elasticsearch" />
                        <el-option label="内置轻量级库 (Dify/MaxKB版)" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="分块策略 (Chunking)">
                      <el-select style="width: 100%;">
                        <el-option label="按语义与模板结构分块" />
                        <el-option label="固定 512 Tokens" />
                        <el-option label="按段落或换行" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- Template Editor -->
            <div class="view-card" style="overflow: hidden;">
              <div class="editor-toolbar">
                <span><el-icon><Grid /></el-icon> 混合知识解析录入</span>
                <el-button text type="primary" size="small">上传源文件</el-button>
              </div>
              <div class="editor-file-types">
                <span class="file-type-label">支持的文件类型：</span>
                <div class="file-types">
                  <el-tag size="small" effect="plain" v-for="ft in fileTypes" :key="ft">{{ ft }}</el-tag>
                </div>
              </div>
              <div class="editor-content">
                <!-- QA Template -->
                <div v-if="selectedTemplate === 'qa'" class="qa-editor">
                  <div class="qa-header">
                    <span class="qa-col">问题 / 术语 (Question)</span>
                    <span class="qa-col-wide">解答 / 定义 (Answer)</span>
                  </div>
                  <div v-for="i in 3" :key="i" class="qa-row">
                    <el-input :placeholder="i === 1 ? qaPlaceholderQ : ''" />
                    <el-input type="textarea" :rows="1" :placeholder="i === 1 ? qaPlaceholderA : ''" />
                  </div>
                  <el-button text style="margin-top: 8px;">
                    <el-icon><Plus /></el-icon> 新增一条 QA 记录
                  </el-button>
                </div>

                <!-- MD Template -->
                <div v-if="selectedTemplate === 'md'" class="md-editor">
                  <el-input type="textarea" :rows="10" :placeholder="mdPlaceholder" style="font-family: 'JetBrains Mono', monospace;" />
                </div>

                <!-- Triple Template -->
                <div v-if="selectedTemplate === 'triple'" class="triple-editor">
                  <div class="triple-header">
                    <span>源实体 (Subject)</span>
                    <span>关系 (Predicate)</span>
                    <span>目标实体 (Object)</span>
                  </div>
                  <div v-for="i in 2" :key="i" class="triple-row">
                    <el-input :placeholder="i === 1 ? triplePlaceholderS : ''" />
                    <el-input :placeholder="i === 1 ? triplePlaceholderP : ''" style="font-family: 'JetBrains Mono', monospace;" />
                    <el-input :placeholder="i === 1 ? triplePlaceholderO : ''" />
                    <el-button text type="danger" :icon="Close" size="small" />
                  </div>
                  <el-button text style="margin-top: 8px;">
                    <el-icon><Plus /></el-icon> 新增三元组
                  </el-button>
                </div>
              </div>
            </div>

            <div class="editor-footer">
              <el-button @click="showEditor = false">返回列表</el-button>
              <el-button type="primary" @click="showEditor = false">
                <el-icon><Coin /></el-icon>
                保存并执行入库向量化任务
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useKnowledgeStore } from '../stores/agent';
import { Close } from '@element-plus/icons-vue';

const knowledgeStore = useKnowledgeStore();

const TEMPLATES = [
  { id: 'qa', name: 'QA 问答对表格', desc: '适用于结构化审讯记录与标准化咨询', icon: 'List' },
  { id: 'md', name: 'Markdown 规范文档', desc: '适用于法律法规、长文本卷宗提取', icon: 'Document' },
  { id: 'triple', name: '三元组抽取 (知识图谱)', desc: '(实体-关系-实体) 适用于资金流向追踪', icon: 'Coin' },
];

const fileTypes = ['.md, .txt, .pdf, .docx, .html, .pptx', '.csv, .xlsx, .jsonl', '.jpg, .png (需开启多模态)'];

const showEditor = ref(false);
const selectedTemplate = ref('qa');
const editingKb = reactive<any>({ name: '', embeddingModel: 'bge-m3-legal' });
const qaPlaceholderQ = '什么是「开板」？';
const qaPlaceholderA = '指吸食冰毒后，将残留在锡纸上的物质收集...';
const mdPlaceholder = '# 第一章 总则\n\n## 第一条 目的\n为了明确电子数据取证标准...';
const triplePlaceholderS = '张三 (嫌疑人)';
const triplePlaceholderP = '转账控制';
const triplePlaceholderO = '李四账户 (尾号3921)';

function openEditor(kb: any) {
  if (kb === 'new') {
    Object.assign(editingKb, { name: '', embeddingModel: 'bge-m3-legal' });
  } else {
    Object.assign(editingKb, { ...kb });
  }
  showEditor.value = true;
}
</script>

<style scoped>
.knowledge-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.kb-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-shrink: 0;
}
.kb-actions {
  display: flex;
  gap: 12px;
}

.kb-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  margin-bottom: 16px;
  transition: box-shadow 0.2s;
}
.kb-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.kb-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}
.kb-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}
.kb-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
}
.kb-identity h3 {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin: 0;
}
.kb-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.status-dot-inline {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 4px;
}
.edit-btn {
  opacity: 0;
  transition: opacity 0.2s;
}
.kb-card:hover .edit-btn {
  opacity: 1;
}

.kb-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.meta-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}
.meta-value {
  font-size: 13px;
  color: #1e293b;
  display: flex;
  align-items: center;
}
.meta-value.mono {
  font-family: 'JetBrains Mono', monospace;
}

.kb-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}
.kb-docs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.kb-restricted {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #dc2626;
  background: #fee2e2;
  padding: 4px 8px;
  border-radius: 4px;
}

.kb-guide {
  margin-top: 32px;
  padding: 20px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 12px;
}
.kb-guide h4 {
  font-size: 13px;
  font-weight: 600;
  color: #312e81;
  margin: 0 0 8px;
}
.kb-guide p {
  font-size: 12px;
  color: #3730a3;
  line-height: 1.6;
  max-width: 768px;
}
.kb-guide code {
  background: #fff;
  padding: 1px 6px;
  border-radius: 4px;
}

/* Drawer */
.drawer-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin: 0;
}
.drawer-header p {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0;
}

.editor-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.template-sidebar {
  width: 256px;
  border-right: 1px solid #f1f5f9;
  background: #f8fafc;
  padding: 16px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.template-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  font-weight: 600;
  padding-left: 4px;
}
.template-btn {
  text-align: left;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.template-btn:hover {
  background: #fff;
  border-color: #e2e8f0;
}
.template-btn.active {
  background: #fff;
  border-color: #c7d2fe;
  box-shadow: 0 0 0 1px #818cf8;
}
.template-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
}
.template-desc {
  font-size: 10px;
  color: #64748b;
  margin-top: 6px;
  line-height: 1.4;
}

.editor-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}
.editor-inner {
  max-width: 768px;
  margin: 0 auto;
}

.editor-toolbar {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.editor-file-types {
  background: rgba(248, 250, 252, 0.5);
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.file-type-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}
.file-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.editor-content {
  padding: 20px;
}

/* QA Editor */
.qa-header {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 0 8px;
}
.qa-row {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 8px;
  margin-top: 8px;
}

/* Triple Editor */
.triple-header {
  display: grid;
  grid-template-columns: 4fr 3fr 4fr;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-align: center;
  padding: 0 8px;
}
.triple-row {
  display: grid;
  grid-template-columns: 4fr 3fr 4fr auto;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}
</style>