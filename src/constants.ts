export const AGENTS = [
  { id: 'agt-law-01', name: '涉黄案件审判专家', role: 'Worker', model: 'gpt-4o', temperature: 0.1, maxSteps: 5, fallback: 'agt-router', skills: ['sk-ocr'], knowledge: ['kb-criminal-law'] },
  { id: 'agt-eco-02', name: '经济犯罪研判专家', role: 'Worker', model: 'o1-preview', temperature: 0.2, maxSteps: 15, fallback: 'agt-router', skills: ['sk-es-search', 'sk-mysql-query'], knowledge: ['kb-economic-crimes'] },
  { id: 'agt-drug-03', name: '涉毒案件侦查专家', role: 'Worker', model: 'gpt-4o', temperature: 0.3, maxSteps: 10, fallback: 'agt-router', skills: ['sk-chat-clean'], knowledge: ['kb-jargon-dict'] },
  { id: 'agt-data-04', name: '电子数据取证专家', role: 'Worker', model: 'gpt-4o', temperature: 0.0, maxSteps: 8, fallback: 'agt-router', skills: ['sk-chat-clean', 'sk-voice-trans'], knowledge: ['kb-digital-forensics'] },
  { id: 'agt-router', name: '意图路由智能体 (Router)', role: 'Router', model: 'gpt-4o-mini', temperature: 0.1, maxSteps: 2, fallback: null, skills: [], knowledge: [] }
];

export const SKILLS = [
  { id: 'sk-voice-trans', name: '语音实时翻译', type: 'REST API', provider: 'ASR Service', auth: 'API Key', status: 'active' },
  { id: 'sk-ocr', name: '图文内容转换 (OCR)', type: 'Container', provider: 'Multimodal Engine', auth: 'None', status: 'active' },
  { id: 'sk-es-search', name: 'Elasticsearch 检索', type: 'gRPC', provider: 'Data Platform', auth: 'mTLS', status: 'active' },
  { id: 'sk-mysql-query', name: 'MySQL 数据库操作', type: 'JDBC', provider: 'Backend', auth: 'DB User', status: 'warning' },
  { id: 'sk-chat-clean', name: '聊天记录清洗', type: 'Python Script', provider: 'Data Governance', auth: 'None', status: 'active' },
  { id: 'sk-text-prep', name: '非结构化文本预处理', type: 'Java SPI', provider: 'NLP Internal', auth: 'None', status: 'active' },
];

export const KNOWLEDGE_BASES = [
  { id: 'kb-criminal-law', name: '刑法与相关司法解释', vectorDb: 'Milvus', embeddingModel: 'bge-m3-legal', docs: 15420, status: 'active' },
  { id: 'kb-jargon-dict', name: '涉黑涉恶及涉毒暗语库', vectorDb: 'Elasticsearch', embeddingModel: 'text-embedding-3-small', docs: 3250, status: 'active' },
  { id: 'kb-economic-crimes', name: '经侦典型案例与洗钱模型', vectorDb: 'pgvector', embeddingModel: 'bge-m3-finance', docs: 8900, status: 'syncing' },
  { id: 'kb-digital-forensics', name: '电子取证操作规范与脱敏规则', vectorDb: 'Milvus', embeddingModel: 'bge-m3', docs: 1240, status: 'active' },
];

// Animated icon names (used by AnimIcon component)
export const NAVIGATION = [
  { id: 'dashboard', name: '系统总览', animIcon: 'dashboard' },
  { id: 'architecture', name: '架构拓扑', animIcon: 'architecture' },
  { id: 'agents', name: '智能体配置', animIcon: 'agent' },
  { id: 'skills', name: '插拔式技能库', animIcon: 'skill' },
  { id: 'knowledge', name: '知识库治理', animIcon: 'knowledge' },
  { id: 'chat', name: '交互调试工作台', animIcon: 'chat' },
];

export const BRANDINGS = [
  { id: 'ruijian', name: '睿鉴', mascot: '🦅', bgColor: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', desc: '深度审查与研判平台' },
  { id: 'haidun', name: '海盾', mascot: '🛡️', bgColor: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', desc: '公共案事件防护屏障' },
  { id: 'zhishu', name: '智枢', mascot: '🐙', bgColor: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', desc: '多智能体协同中枢' },
  { id: 'ruitong', name: '睿瞳', mascot: '👁️', bgColor: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', desc: '全域数据取证天眼' }
];