import { useState } from 'react';
import { Bot, Plus, Server, Settings2, Trash2, X, Save, Check, HelpCircle } from 'lucide-react';
import { SKILLS, KNOWLEDGE_BASES } from '../constants';

export default function AgentsView({ agents, setAgents }: { agents: any[], setAgents: any }) {
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (agent: any) => {
    setFormData({ 
      ...agent, 
      selectedSkills: [...agent.skills], 
      selectedKb: [...agent.knowledge] 
    });
    setEditingAgent(agent.id);
  };

  const handleCreate = () => {
    setFormData({
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
    setEditingAgent('new');
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该智能体配置？')) {
      setAgents((prev: any[]) => prev.filter(a => a.id !== id));
      if (editingAgent === id) setEditingAgent(null);
    }
  };

  const handleToggleArr = (arrName: 'selectedSkills' | 'selectedKb', val: string) => {
    setFormData((prev: any) => {
      const arr = prev[arrName] || [];
      if (arr.includes(val)) {
        return { ...prev, [arrName]: arr.filter((x: string) => x !== val) };
      } else {
        return { ...prev, [arrName]: [...arr, val] };
      }
    });
  };

  const handleSave = () => {
    const updatedAgent = {
      ...formData,
      temperature: parseFloat(formData.temperature),
      maxSteps: parseInt(formData.maxSteps, 10),
      skills: formData.selectedSkills,
      knowledge: formData.selectedKb,
    };
    delete updatedAgent.selectedSkills;
    delete updatedAgent.selectedKb;

    if (editingAgent === 'new') {
      setAgents((prev: any[]) => [...prev, updatedAgent]);
    } else {
      setAgents((prev: any[]) => prev.map(a => a.id === editingAgent ? updatedAgent : a));
    }
    setEditingAgent(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">智能体配置 (Agent Profiles)</h2>
          <p className="text-slate-500 mt-2">定义调度系统中的核心智能体角色，绑定技能与业务知识库。</p>
        </div>
        <button onClick={handleCreate} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          新建智能体配置
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">基本信息</th>
              <th className="px-6 py-4 font-medium">模型驱动</th>
              <th className="px-6 py-4 font-medium">编排策略设定</th>
              <th className="px-6 py-4 font-medium">挂载依赖 (Skills / KB)</th>
              <th className="px-6 py-4 font-medium text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{agent.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{agent.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-mono text-slate-700 font-medium">
                      <Server className="w-3.5 h-3.5 text-slate-400" />
                      {agent.model}
                    </span>
                    <span className="text-xs text-slate-500">Temp: {agent.temperature}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                       <span className="w-16 text-slate-500">Max Steps :</span>
                       <span className="font-medium text-slate-800">{agent.maxSteps}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-16 text-slate-500">降级策略  :</span>
                       {agent.fallback ? (
                         <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded">{agent.fallback}</span>
                       ) : (
                         <span className="text-[10px] text-slate-400">无 (终止)</span>
                       )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex max-w-[200px] flex-wrap gap-1.5">
                     {agent.skills.map((s, i) => (
                       <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                         {s}
                       </span>
                     ))}
                     {agent.knowledge.map((k, i) => (
                       <span key={i} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                         {k}
                       </span>
                     ))}
                     {agent.skills.length === 0 && agent.knowledge.length === 0 && (
                       <span className="text-xs text-slate-400 italic">None</span>
                     )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-slate-400">
                    <button onClick={() => handleEdit(agent)} className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors">
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(agent.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
               <h3 className="text-lg font-bold text-slate-800">{editingAgent === 'new' ? '创建新智能体' : '编辑智能体配置'}</h3>
               <button onClick={() => setEditingAgent(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5">
               <div className="grid grid-cols-2 gap-5">
                 <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">智能体名称</label>
                   <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">逻辑角色 (Role)</label>
                   <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                     <option value="Worker">专家 Worker</option>
                     <option value="Router">路由 Router</option>
                     <option value="Supervisor">主管 Supervisor</option>
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-5">
                 <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">底层模型</label>
                   <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">随机度 (Temp)</label>
                   <input type="number" step="0.1" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
                 </div>
                 <div>
                   <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider tooltip-trigger relative group cursor-help">
                     最大步数 (Max Steps)
                     <HelpCircle className="w-3.5 h-3.5" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-slate-200 text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 z-10 normal-case tracking-normal">
                       限制大模型在单次决策中调用工具的最大循环次数，防止陷入死循环。
                     </div>
                   </label>
                   <input type="number" value={formData.maxSteps} onChange={e => setFormData({...formData, maxSteps: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">关联技能池 (Skills)</label>
                 <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1">
                   {SKILLS.map(skill => (
                     <label key={skill.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                       <input type="checkbox" className="hidden" checked={formData.selectedSkills?.includes(skill.id) || false} onChange={() => handleToggleArr('selectedSkills', skill.id)} />
                       <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${formData.selectedSkills?.includes(skill.id) ? 'bg-indigo-600' : 'bg-white border border-slate-300'}`}>
                         {formData.selectedSkills?.includes(skill.id) && <Check className="w-3 h-3 text-white" />}
                       </div>
                       <div className="text-sm text-slate-700">{skill.name}</div>
                     </label>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">挂载知识库 (RAG Knowledge Bases)</label>
                 <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1">
                   {KNOWLEDGE_BASES.map(kb => (
                     <label key={kb.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                       <input type="checkbox" className="hidden" checked={formData.selectedKb?.includes(kb.id) || false} onChange={() => handleToggleArr('selectedKb', kb.id)} />
                       <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${formData.selectedKb?.includes(kb.id) ? 'bg-amber-600' : 'bg-white border border-slate-300'}`}>
                         {formData.selectedKb?.includes(kb.id) && <Check className="w-3 h-3 text-white" />}
                       </div>
                       <div className="text-sm text-slate-700">{kb.name}</div>
                     </label>
                   ))}
                 </div>
               </div>
               
               <div>
                 <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider cursor-help group relative">
                   降级策略 (Fallback Target)
                   <HelpCircle className="w-3.5 h-3.5" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-slate-800 text-slate-200 text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 z-10 normal-case tracking-normal">
                     当当前智能体遭遇异常、或者置信度过低无法解决问题时，接管会话流转的备用目标智能体。(例如转交给人工或降级路由)
                   </div>
                 </label>
                 <select value={formData.fallback || ''} onChange={e => setFormData({...formData, fallback: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono bg-slate-100">
                    <option value="">（无 / 直接终止）</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                 </select>
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50 rounded-b-2xl">
               <button onClick={() => setEditingAgent(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">取消</button>
               <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                 <Save className="w-4 h-4" />
                 保存智能体配置
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
