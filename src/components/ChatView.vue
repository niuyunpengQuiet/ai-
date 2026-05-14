<template>
  <div class="chat-view">
    <h2 class="view-title" style="font-style: italic; color: #94a3b8;">AI 对话 (Chat)</h2>
    <p class="view-subtitle" style="max-width: 640px;">
      与多智能体系统进行实时交互，支持同步/流式/推理模式、思维链展示与 Markdown 渲染。
    </p>

    <div class="chat-layout">
      <!-- Messages Area -->
      <div class="chat-main">
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <el-icon :size="48" color="#cbd5e1"><ChatDotRound /></el-icon>
            <p>开始与 AI 智能体对话</p>
            <p class="empty-hint">选择智能体并输入问题，支持流式输出与思维链展示</p>
          </div>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['chat-message', msg.role]"
          >
            <div class="msg-avatar">
              <el-avatar :size="32" :style="{ background: msg.role === 'user' ? '#4f46e5' : '#7c3aed' }">
                <el-icon><component :is="msg.role === 'user' ? 'User' : 'Monitor'" /></el-icon>
              </el-avatar>
            </div>
            <div class="msg-body">
              <div class="msg-meta">
                <span class="msg-sender">{{ msg.role === 'user' ? 'You' : msg.agentName || 'AI' }}</span>
                <span class="msg-time">{{ msg.timestamp }}</span>
              </div>

              <!-- CoT Trace -->
              <div v-if="msg.cotTrace" class="cot-trace">
                <el-collapse>
                  <el-collapse-item title="思维链 (Chain of Thought)">
                    <div class="cot-steps">
                      <el-steps direction="vertical" :active="msg.cotTrace.steps.length" finish-status="success">
                        <el-step
                          v-for="(step, idx) in msg.cotTrace.steps"
                          :key="idx"
                          :title="step.action"
                          :description="step.observation"
                        />
                      </el-steps>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>

              <!-- Markdown Content -->
              <div class="msg-content markdown-body" v-html="renderMarkdown(msg.content)"></div>

              <!-- Typing indicator -->
              <div v-if="msg.isStreaming" class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area">
          <div class="input-row">
            <el-input
              v-model="inputText"
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              :autosize="{ minRows: 1, maxRows: 4 }"
              type="textarea"
              resize="none"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <el-button type="primary" :icon="Promotion" @click="sendMessage" :disabled="!inputText.trim()">发送</el-button>
          </div>
        </div>
      </div>

      <!-- Settings Panel -->
      <div class="chat-settings">
        <div class="settings-section">
          <label class="settings-label">智能体选择</label>
          <el-checkbox-group v-model="selectedAgents">
            <el-checkbox
              v-for="agent in agentStore.agents"
              :key="agent.id"
              :label="agent.id"
              :value="agent.id"
              border
              size="small"
            >
              {{ agent.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="settings-section">
          <label class="settings-label">权重分配</label>
          <div v-for="agentId in selectedAgents" :key="agentId" class="weight-row">
            <span class="weight-name">{{ getAgentName(agentId) }}</span>
            <el-slider v-model="weights[agentId]" :min="0" :max="100" :show-tooltip="false" size="small" />
            <span class="weight-val">{{ weights[agentId] || 0 }}</span>
          </div>
        </div>

        <div class="settings-section">
          <label class="settings-label">交互模式</label>
          <el-radio-group v-model="interactionMode" size="small">
            <el-radio-button value="sync">同步</el-radio-button>
            <el-radio-button value="stream">流式</el-radio-button>
            <el-radio-button value="cot">推理</el-radio-button>
          </el-radio-group>
          <div v-if="interactionMode === 'cot'" class="mode-hint">
            <el-icon :size="12" color="#7c3aed"><InfoFilled /></el-icon>
            <span>逐步展示 Thought → Action → Observation 推理链</span>
          </div>
        </div>

        <div class="settings-section">
          <label class="settings-label">编排模式</label>
          <el-select v-model="orchestrationPattern" size="small" style="width: 100%;">
            <el-option label="Router-MoE" value="router-moe" />
            <el-option label="ReAct" value="react" />
            <el-option label="Plan-and-Solve" value="plan-solve" />
            <el-option label="Hierarchical" value="hierarchical" />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { Promotion, InfoFilled } from '@element-plus/icons-vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { useAgentStore } from '../stores/agent';

const agentStore = useAgentStore();

// Markdown renderer with highlight.js
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (_) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

function renderMarkdown(content: string): string {
  return md.render(content || '');
}

// Chat state
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  timestamp: string;
  isStreaming?: boolean;
  cotTrace?: { steps: Array<{ action: string; observation: string }> };
}

const messages = ref<ChatMessage[]>([]);
const inputText = ref('');
const selectedAgents = ref<string[]>([]);
const weights = ref<Record<string, number>>({});
const interactionMode = ref('stream');
const orchestrationPattern = ref('router-moe');
const messagesContainer = ref<HTMLElement | null>(null);

function getAgentName(id: string): string {
  return agentStore.agents.find(a => a.id === id)?.name || id;
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch(messages, () => scrollToBottom(), { deep: true });

function sendMessage() {
  const text = inputText.value.trim();
  if (!text) return;

  // Add user message
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: text,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  });

  inputText.value = '';

  // Simulate AI response
  if (interactionMode.value === 'stream') {
    simulateStreamResponse(text);
  } else if (interactionMode.value === 'cot') {
    simulateCotResponse(text);
  } else {
    simulateSyncResponse(text);
  }
}

function simulateSyncResponse(userText: string) {
  const agentName = selectedAgents.value.length > 0
    ? getAgentName(selectedAgents.value[0])
    : 'AI Assistant';

  messages.value.push({
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: `收到您的问题："${userText}"\n\n我正在分析中，以下是初步结果：\n\n1. **意图识别**：您的问题属于法务咨询范畴\n2. **知识检索**：已从知识库检索到 3 条相关文档\n3. **推理结论**：根据《刑法》第XXX条相关规定...\n\n> 以上内容仅供参考，不构成法律建议。`,
    agentName,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  });
}

function simulateStreamResponse(userText: string) {
  const agentName = selectedAgents.value.length > 0
    ? getAgentName(selectedAgents.value[0])
    : 'AI Assistant';

  const fullResponse = `收到您的问题："${userText}"\n\n我正在通过 **${orchestrationPattern.value}** 模式进行推理：\n\n### 思考过程\n\n1. **意图分类**：识别为法务咨询类问题\n2. **专家路由**：已分发给法务专家 Worker\n3. **知识检索**：从 ES 索引中获取 3 条相关判例\n\n### 分析结果\n\n\`\`\`json\n{\n  "confidence": 0.92,\n  "matched_articles": ["刑法第XXX条", "司法解释第XX号"],\n  "risk_level": "medium"\n}\n\`\`\`\n\n> 以上内容仅供参考，不构成法律建议。`;

  const msgId = (Date.now() + 1).toString();
  const streamMsg: ChatMessage = {
    id: msgId,
    role: 'assistant',
    content: '',
    agentName,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isStreaming: true,
    cotTrace: orchestrationPattern.value !== 'react' ? undefined : {
      steps: [
        { action: 'Thought: 分析用户意图', observation: '识别为法务咨询类问题' },
        { action: 'Action: SearchTool("刑法 XXX条")', observation: '检索到 3 条相关文档' },
        { action: 'Thought: 综合分析', observation: '生成最终回答' },
      ],
    },
  };

  messages.value.push(streamMsg);

  // Simulate streaming character by character
  let charIndex = 0;
  const interval = setInterval(() => {
    if (charIndex < fullResponse.length) {
      const chunkSize = Math.floor(Math.random() * 3) + 1;
      const nextIndex = Math.min(charIndex + chunkSize, fullResponse.length);
      const msg = messages.value.find(m => m.id === msgId);
      if (msg) {
        msg.content = fullResponse.slice(0, nextIndex);
      }
      charIndex = nextIndex;
    } else {
      const msg = messages.value.find(m => m.id === msgId);
      if (msg) {
        msg.isStreaming = false;
      }
      clearInterval(interval);
    }
  }, 30);
}

function simulateCotResponse(userText: string) {
  const agentName = selectedAgents.value.length > 0
    ? getAgentName(selectedAgents.value[0])
    : 'AI Assistant';

  const cotSteps = [
    { action: 'Thought: 解析用户诉求', observation: '识别为「' + userText + '」— 属于法务咨询类问题' },
    { action: 'Action: IntentClassifier()', observation: '置信度 0.94 → 路由至法务专家 Worker' },
    { action: 'Action: SearchTool("刑法 相关条款")', observation: 'ES 索引检索到 3 条相关判例' },
    { action: 'Thought: 交叉验证检索结果', observation: '判例与用户诉求匹配度 0.91，无矛盾' },
    { action: 'Action: RerankTool(results)', observation: '重排序后 Top-2 文档置信度 > 0.85' },
    { action: 'Thought: 综合推理与归纳', observation: '生成结构化回答，附带法条引用' },
  ];

  const finalContent = `### 推理结论\n\n根据上述思维链推理，综合分析如下：\n\n1. **适用法条**：《刑法》第XXX条、司法解释第XX号\n2. **匹配判例**：3 条相关判例（置信度 0.91）\n3. **风险等级**：中等\n\n\`\`\`json\n{\n  "confidence": 0.94,\n  "matched_articles": ["刑法第XXX条", "司法解释第XX号"],\n  "risk_level": "medium",\n  "reasoning_depth": 6\n}\n\`\`\`\n\n> 以上内容仅供参考，不构成法律建议。`;

  const msgId = (Date.now() + 1).toString();
  const cotMsg: ChatMessage = {
    id: msgId,
    role: 'assistant',
    content: '',
    agentName,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isStreaming: true,
    cotTrace: { steps: [] },
  };

  messages.value.push(cotMsg);

  // Animate CoT steps one by one
  let stepIndex = 0;
  const stepInterval = setInterval(() => {
    if (stepIndex < cotSteps.length) {
      const msg = messages.value.find(m => m.id === msgId);
      if (msg && msg.cotTrace) {
        msg.cotTrace.steps = [...msg.cotTrace.steps, cotSteps[stepIndex]];
      }
      stepIndex++;
    } else {
      clearInterval(stepInterval);

      // After all CoT steps, stream the final content
      let charIndex = 0;
      const contentInterval = setInterval(() => {
        if (charIndex < finalContent.length) {
          const chunkSize = Math.floor(Math.random() * 3) + 1;
          const nextIndex = Math.min(charIndex + chunkSize, finalContent.length);
          const msg = messages.value.find(m => m.id === msgId);
          if (msg) {
            msg.content = finalContent.slice(0, nextIndex);
          }
          charIndex = nextIndex;
        } else {
          const msg = messages.value.find(m => m.id === msgId);
          if (msg) {
            msg.isStreaming = false;
          }
          clearInterval(contentInterval);
        }
      }, 25);
    }
  }, 600);
}
</script>

<style scoped>
.chat-view {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-layout {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 8px;
}
.empty-state p { font-size: 14px; margin: 0; }
.empty-hint { font-size: 12px !important; color: #cbd5e1; }

.chat-message {
  display: flex;
  gap: 12px;
}
.chat-message.user {
  flex-direction: row-reverse;
}
.chat-message.user .msg-body {
  align-items: flex-end;
}
.chat-message.user .msg-meta {
  flex-direction: row-reverse;
}
.chat-message.user .msg-content {
  background: #4f46e5;
  color: #fff;
  border-radius: 12px 4px 12px 12px;
}

.msg-avatar {
  flex-shrink: 0;
}

.msg-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 70%;
}
.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.msg-sender {
  font-weight: 600;
  color: #1e293b;
}
.msg-time {
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}

.msg-content {
  padding: 12px 16px;
  border-radius: 4px 12px 12px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

/* Markdown styles */
.msg-content.markdown-body :deep(h3) {
  font-size: 14px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #1e293b;
}
.msg-content.markdown-body :deep(p) {
  margin: 6px 0;
}
.msg-content.markdown-body :deep(ol),
.msg-content.markdown-body :deep(ul) {
  padding-left: 20px;
  margin: 6px 0;
}
.msg-content.markdown-body :deep(blockquote) {
  border-left: 3px solid #c7d2fe;
  padding: 4px 12px;
  margin: 8px 0;
  color: #64748b;
  background: #f8fafc;
  border-radius: 0 4px 4px 0;
}
.msg-content.markdown-body :deep(pre.hljs) {
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  margin: 8px 0;
}
.msg-content.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.msg-content.markdown-body :deep(:not(pre) > code) {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #7c3aed;
}
.msg-content.markdown-body :deep(strong) {
  color: #1e293b;
}

/* CoT Trace */
.cot-trace {
  margin-bottom: 6px;
}
.cot-trace :deep(.el-collapse-item__header) {
  font-size: 12px;
  color: #7c3aed;
  font-weight: 600;
  height: 32px;
  line-height: 32px;
}
.cot-steps {
  padding: 8px 0;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c7d2fe;
  animation: typing 1.4s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* Input Area */
.chat-input-area {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #fff;
}
.input-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.input-row .el-input {
  flex: 1;
}

/* Settings Panel */
.chat-settings {
  width: 288px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.settings-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  font-weight: 700;
}
.settings-section .el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.weight-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.weight-name {
  font-size: 12px;
  color: #475569;
  width: 80px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.weight-row .el-slider {
  flex: 1;
}
.weight-val {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  width: 28px;
  text-align: right;
}

.mode-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #7c3aed;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  border-radius: 6px;
  padding: 6px 10px;
  margin-top: 4px;
}
</style>