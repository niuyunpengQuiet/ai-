import { useState } from 'react';
import { KNOWLEDGE_BASES } from '../constants';
import { Library, CloudUpload, Database, FileText, UploadCloud, Search, ShieldAlert, Plus, X, List, LayoutTemplate } from 'lucide-react';
import { cn } from '../lib/utils';

const TEMPLATES = [
  { id: 'qa', name: 'QA 问答对表格', desc: '适用于结构化审讯记录与标准化咨询', icon: List },
  { id: 'md', name: 'Markdown 规范文档', desc: '适用于法律法规、长文本卷宗提取', icon: FileText },
  { id: 'triple', name: '三元组抽取 (知识图谱)', desc: '(实体-关系-实体) 适用于资金流向追踪', icon: Database },
];

export default function KnowledgeView() {
  const [editingKb, setEditingKb] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('qa');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">知识库治理 (RAG Vector DB)</h2>
          <p className="text-slate-500 mt-2">管理涉黑案事件、暗语词典等图文案卷的检索策略与模型权限。</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <UploadCloud className="w-4 h-4" />
            批量导入语料
          </button>
          <button onClick={() => setEditingKb('new')} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            可视化新建知识库
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KNOWLEDGE_BASES.map(kb => (
            <div key={kb.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <Library className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{kb.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200">{kb.id}</span>
                      {kb.status === 'active' 
                        ? <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>就绪</span>
                        : <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>向量化中</span>
                      }
                    </div>
                  </div>
                </div>
                <button onClick={() => setEditingKb(kb)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-all" title="可视化构建">
                  <LayoutTemplate className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Embedding 引擎</div>
                  <div className="font-mono text-sm text-slate-800">{kb.embeddingModel}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">向量后端</div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    {kb.vectorDb}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Search className="w-3.5 h-3.5" />
                  <span className="font-mono bg-slate-100 px-1 rounded">{kb.docs.toLocaleString()}</span> 个文档切片
                </div>
                {kb.id.includes('internal') && (
                  <div className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded">
                    <ShieldAlert className="w-3 h-3" />
                    高密级阻断
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <h4 className="text-sm font-semibold text-indigo-900">编排指南：动态注入上下文</h4>
          <p className="text-xs text-indigo-700 mt-2 max-w-3xl leading-relaxed">
            知识库独立于智能体运行。编排层 (Orchestrator) 会在运行时将「本轮可用的私有检索列表」动态注入到目标请求中。若检索准确度不足、响应超时或模型置信度较低，系统中配置的降级策略 (<code className="bg-white px-1 rounded">fallbackAgentId</code>) 会自动接管会话，从而避免在司法审判等关键环节中产生幻觉风险。
          </p>
        </div>
      </div>

      {editingKb && (
        <div className="absolute inset-0 bg-white z-20 flex flex-col">
           <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
             <div>
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                 可视化知识构建与编辑
               </h3>
               <p className="text-sm text-slate-500 mt-1">选择标准化模板结构，快速录入并向量化领域知识。</p>
             </div>
             <button onClick={() => setEditingKb(null)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md hover:bg-slate-100">
               <X className="w-6 h-6" />
             </button>
           </div>
           
           <div className="flex-1 flex overflow-hidden">
             {/* Left Templates Menu */}
             <div className="w-64 border-r border-slate-100 bg-slate-50 p-4 shrink-0 flex flex-col gap-3">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">数据切片模板</label>
               {TEMPLATES.map(t => (
                 <button
                   key={t.id}
                   onClick={() => setSelectedTemplate(t.id)}
                   className={cn(
                     "text-left p-3 rounded-lg border transition-all",
                     selectedTemplate === t.id 
                       ? "bg-white border-indigo-200 ring-1 ring-indigo-500 shadow-sm" 
                       : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
                   )}
                 >
                   <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                     <t.icon className={cn("w-4 h-4", selectedTemplate === t.id ? "text-indigo-600" : "text-slate-400")} />
                     {t.name}
                   </div>
                   <div className="text-[10px] text-slate-500 mt-1.5 leading-snug">{t.desc}</div>
                 </button>
               ))}
             </div>

             {/* Right Editor Area */}
             <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Common Meta */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">知识集名称</label>
                       <input type="text" defaultValue={editingKb?.name || ''} placeholder="例如：涉毒黑话1000条" className="w-full border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-slate-50" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">向量模型</label>
                         <select className="w-full border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                           <option>bge-m3-legal (司法专精)</option>
                           <option>text-embedding-3-small</option>
                           <option>bge-m3-finance (经侦专精)</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">向量后端 (Vector DB)</label>
                         <select className="w-full border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                           <option>纯向量检索: Milvus</option>
                           <option>纯向量检索: Qdrant</option>
                           <option>纯向量检索: Weaviate</option>
                           <option>纯向量检索: FAISS</option>
                           <option>混合检索: Milvus + Elasticsearch</option>
                           <option>内置轻量级库 (Dify/MaxKB版)</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">分块策略 (Chunking)</label>
                         <select className="w-full border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-slate-50">
                           <option>按语义与模板结构分块</option>
                           <option>固定 512 Tokens</option>
                           <option>按段落或换行</option>
                         </select>
                       </div>
                     </div>
                  </div>

                  {/* Template Editor Wrapper */}
                  <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                         <LayoutTemplate className="w-4 h-4" /> 混合知识解析录入
                      </span>
                      <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800">上传源文件</button>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                      <p className="text-xs text-slate-500 mb-2 font-semibold">支持的文件类型：</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">.md, .txt, .pdf, .docx, .html, .pptx</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">.csv, .xlsx, .jsonl</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">.jpg, .png (需开启多模态)</span>
                      </div>
                    </div>

                    <div className="p-5">
                       {selectedTemplate === 'qa' && (
                         <div className="space-y-4">
                           <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-2">
                             <div className="col-span-5">问题 / 术语 (Question)</div>
                             <div className="col-span-7">解答 / 定义 (Answer)</div>
                           </div>
                           {[1,2,3].map(i => (
                             <div key={i} className="grid grid-cols-12 gap-2">
                               <input placeholder={i === 1 ? '什么是“开板”？' : ''} className="col-span-5 text-sm border-slate-200 px-3 py-2 rounded focus:outline-none shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
                               <textarea rows={1} placeholder={i === 1 ? '指吸食冰毒后，将残留在锡纸上的物质收集...' : ''} className="col-span-7 text-sm border-slate-200 px-3 py-2 rounded focus:outline-none shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none bg-slate-50"></textarea>
                             </div>
                           ))}
                           <button className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 py-2 font-medium">
                             <Plus className="w-4 h-4" /> 新增一条 QA 记录
                           </button>
                         </div>
                       )}

                       {selectedTemplate === 'md' && (
                         <div className="h-64">
                           <textarea className="w-full h-full p-4 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono focus:outline-none focus:bg-white transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="# 第一章 总则\n\n## 第一条 目的\n为了明确电子数据取证标准..."></textarea>
                         </div>
                       )}

                       {selectedTemplate === 'triple' && (
                         <div className="space-y-4">
                           <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-2 text-center">
                             <div className="col-span-4">源实体 (Subject)</div>
                             <div className="col-span-3">关系 (Predicate)</div>
                             <div className="col-span-4">目标实体 (Object)</div>
                           </div>
                           {[1,2].map(i => (
                             <div key={i} className="grid grid-cols-12 gap-2 items-center">
                               <input placeholder={i === 1 ? '张三 (嫌疑人)' : ''} className="col-span-4 text-sm px-3 py-2 border-slate-200 rounded focus:outline-none shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center bg-blue-50/50" />
                               <input placeholder={i === 1 ? '转账控制' : ''} className="col-span-3 text-sm px-3 py-2 border-slate-200 rounded focus:outline-none shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center font-mono text-slate-600 bg-slate-50" />
                               <input placeholder={i === 1 ? '李四账户 (尾号3921)' : ''} className="col-span-4 text-sm px-3 py-2 border-slate-200 rounded focus:outline-none shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center bg-emerald-50/50" />
                               <button className="col-span-1 border-none text-slate-400 hover:text-red-500 flex justify-center"><X className="w-4 h-4" /></button>
                             </div>
                           ))}
                           <button className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 py-2 font-medium">
                             <Plus className="w-4 h-4" /> 新增三元组
                           </button>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setEditingKb(null)} className="px-6 py-2 border border-slate-200 rounded-md text-slate-600 font-medium hover:bg-slate-50">返回列表</button>
                    <button onClick={() => setEditingKb(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                       <Database className="w-4 h-4" />
                       保存并执行入库向量化任务
                    </button>
                  </div>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
