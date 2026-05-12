import { useState } from 'react';
import { ArrowRight, Box, BrainCircuit, Database, Globe, Network, Server, Webhook, GitMerge, FileText, Activity, Users, Bot, Info } from 'lucide-react';
import { cn } from '../lib/utils';

function Node({ icon: Icon, title, desc, children, className }: any) {
  return (
    <div className={cn("p-5 rounded-xl border bg-white shadow-sm flex flex-col items-start gap-3", className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100/80 ring-1 ring-slate-200/50">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 leading-none">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
      </div>
      {children && (
        <div className="w-full pt-3 mt-1 border-t border-dashed border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

const PATTERNS = [
  { id: 'router-moe', name: '基于路由的混合专家 (MoE)', desc: '动态分发意图至领域专家，适合边界清晰的任务分类', purpose: '通过前置的轻量级分类模型，将用户请求精准分发给擅长该领域的专家智能体，从而在保证专业性的同时优化整体大模型的调用成本与响应延迟。' },
  { id: 'react', name: 'ReAct 推理执行闭环', desc: '单体 / 多体推理与动作协同', purpose: '大模型交替进行“思考(Thought)”与“行动(Action)”，能够自主调用检索、代码沙盒等工具获取外部信息，直到得出最终结论。适合需要多步信息收集的复杂问题。' },
  { id: 'plan-solve', name: 'Plan-and-Solve 调度', desc: '规划器拆解任务，执行者完成', purpose: '面对极其复杂的长线任务，先由规划智能体(Planner)拆解出DAG(有向无环图)格式的子任务，再交由执行智能体(Executor)去并行或顺序完成，大幅提升任务成功率。' },
  { id: 'hierarchical', name: '层级化多智能体', desc: '主管 (Supervisor) 协调网状团队', purpose: '在大型团队协作场景中，设立各级主管/裁判(Supervisor)。主管不直接处理具体工作，而是负责将任务委派给下属的专职智能体，并审核他们的结果。' },
];

export default function ArchitectureView() {
  const [activePattern, setActivePattern] = useState(PATTERNS[0].id);
  const activeDesc = PATTERNS.find(p => p.id === activePattern)?.purpose;


  const renderGraph = () => {
    switch (activePattern) {
      case 'router-moe':
        return (
          <>
            <div className="flex justify-center flex-col items-center gap-4">
              <Node icon={Network} title="Orchestration Service" desc="意图路由与会话控制" className="w-[32rem] border-purple-200 bg-purple-50/50 ring-4 ring-white" >
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white px-3 py-2 border border-purple-100 rounded-md text-purple-700 flex items-center justify-between"><span>Intent Classifier</span><ArrowRight className="w-3 h-3 opacity-50" /></div>
                  <div className="bg-white px-3 py-2 border border-purple-100 rounded-md text-purple-700 flex items-center justify-between"><span>Weight Adjuster</span><ArrowRight className="w-3 h-3 opacity-50" /></div>
                </div>
              </Node>
            </div>
            <div className="flex justify-between px-32 -my-9 z-0">
              <div className="w-px h-12 border-l-2 border-dashed border-slate-300 transform -rotate-[30deg] translate-x-12 translate-y-2"></div>
              <div className="w-px h-12 border-l-2 border-dashed border-slate-300"></div>
              <div className="w-px h-12 border-l-2 border-dashed border-slate-300 transform rotate-[30deg] -translate-x-12 translate-y-2"></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Node icon={BrainCircuit} title="法务专家 Worker" desc="刑法与相关解释知识库" className="border-indigo-200 bg-indigo-50/50" />
              <Node icon={BrainCircuit} title="经侦专家 Worker" desc="资金流动分析与图谱计算" className="border-emerald-200 bg-emerald-50/50" />
              <Node icon={BrainCircuit} title="禁毒专家 Worker" desc="涉毒黑话与暗语辅助判别" className="border-amber-200 bg-amber-50/50" />
            </div>
          </>
        );
      case 'react':
        return (
          <div className="flex items-center justify-center h-full pt-8">
            <div className="flex flex-col items-center relative">
              {/* Loop path */}
              <div className="absolute top-[60px] w-64 h-32 border-2 border-dashed border-indigo-300 rounded-full"></div>
              <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-mono font-bold text-slate-500 mb-8 z-10">User Query</div>
              <Node icon={Activity} title="ReAct Agent" desc="Thought, Action, Observation" className="w-[20rem] z-10 border-indigo-200 bg-white" >
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><b>Thought:</b> 分析用户意图，我需要搜索涉案记录。</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><b>Action:</b> SearchTool("案件编号")</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><b>Observation:</b> ES 检索返回结果 3 条。</div>
                </div>
              </Node>
              <div className="w-px h-12 border-l-2 border-dashed border-slate-300 my-4 z-10"></div>
              <Node icon={Box} title="Tools / Skills" desc="外部能力与沙盒" className="w-[16rem] z-10" />
            </div>
          </div>
        );
      case 'plan-solve':
        return (
           <div className="flex flex-col items-center h-full w-full max-w-3xl mx-auto gap-8 pt-4">
             <Node icon={FileText} title="Planner (规划器)" desc="将复杂涉案诉求拆解为DAG子任务" className="w-full border-blue-200 bg-blue-50/50">
               <div className="flex gap-4 p-2 text-xs font-mono bg-white rounded border border-blue-100">
                 <div className="flex-1 bg-slate-50 p-2 rounded">1. 提取资金流</div>
                 <ArrowRight className="w-4 h-4 my-auto text-slate-300"/>
                 <div className="flex-1 bg-slate-50 p-2 rounded">2. 匹配洗钱模型</div>
                 <ArrowRight className="w-4 h-4 my-auto text-slate-300"/>
                 <div className="flex-1 bg-slate-50 p-2 rounded">3. 生成报告</div>
               </div>
             </Node>
             <div className="w-px h-8 border-l-2 border-dashed border-slate-300 -my-4"></div>
             <div className="grid grid-cols-2 gap-8 w-full">
               <Node icon={BrainCircuit} title="Executor A (执行)" desc="数据提取模块" className="w-full" />
               <Node icon={BrainCircuit} title="Executor B (执行)" desc="分析聚合模块" className="w-full" />
             </div>
           </div>
        );
      case 'hierarchical':
         return (
           <div className="flex flex-col items-center h-full w-full max-w-4xl mx-auto pt-4 relative">
             <Node icon={Server} title="Top Supervisor (总管)" desc="全盘调配，不亲自办案" className="w-[20rem] mb-12 border-slate-800 bg-slate-50 border-2" />
             <div className="absolute top-[88px] w-px h-12 border-l-2 border-slate-300"></div>
             
             <div className="w-3/4 h-px border-t-2 border-slate-300 absolute top-[136px]"></div>
             
             <div className="grid grid-cols-2 w-full gap-24 mt-4">
               <div className="flex flex-col items-center">
                 <div className="w-px h-12 border-l-2 border-slate-300 mb-0 -mt-16"></div>
                 <Node icon={Users} title="侦查梳理小队" desc="Team Supervisor" className="w-[16rem] mb-8 border-indigo-300 bg-indigo-50" />
                 <div className="flex gap-4">
                   <Node icon={Bot} title="取证专家" className="w-[10rem] text-sm" />
                   <Node icon={Bot} title="现场勘查" className="w-[10rem] text-sm" />
                 </div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-px h-12 border-l-2 border-slate-300 mb-0 -mt-16"></div>
                 <Node icon={Users} title="法务审计小队" desc="Team Supervisor" className="w-[16rem] mb-8 border-amber-300 bg-amber-50" />
                 <div className="flex gap-4">
                   <Node icon={Bot} title="卷宗分析" className="w-[10rem] text-sm" />
                   <Node icon={Bot} title="合规审查" className="w-[10rem] text-sm" />
                 </div>
               </div>
             </div>
           </div>
         );
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-serif italic text-slate-400">架构拓扑 (Architecture Viewer)</h2>
        <p className="text-slate-500 mt-2 max-w-2xl text-sm">
          通过动态视图了解多种工业级 AI 编排模式的原理与结构，支持理论支撑与实时节点映射。
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-4 shrink-0 flex flex-col gap-2 overflow-y-auto">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 ml-1 block">Architecture Patterns</label>
          {PATTERNS.map(p => (
            <button 
              key={p.id}
              onClick={() => setActivePattern(p.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1",
                activePattern === p.id 
                  ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500" 
                  : "bg-white border-slate-100 hover:border-slate-300"
              )}
            >
              <div className="font-semibold text-sm text-slate-800">{p.name}</div>
              <div className="text-xs text-slate-500">{p.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-8 relative overflow-y-auto flex flex-col">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="relative z-10 w-full mb-6">
            <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-xl flex gap-3 text-sm text-indigo-900 shadow-sm">
              <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-1">设计意图 (Purpose)</strong>
                <span className="leading-relaxed text-indigo-800/80">{activeDesc}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full flex-1 flex flex-col mt-4">
            {renderGraph()}
          </div>
        </div>
      </div>
    </div>
  );
}
