import { SKILLS } from '../constants';
import { Box, Plus, Wrench } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SkillsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">插拔式 Skill 库</h2>
          <p className="text-slate-500 mt-2">将外部 API、脚本或内部 Java SPI 封装为原子能力供智能体调用。</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          注册 Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILLS.map((skill) => (
          <div key={skill.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{skill.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{skill.id}</p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded",
                skill.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              )}>
                {skill.status}
              </span>
            </div>
            
            <div className="pt-4 border-t border-dashed border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">接入类型</span>
                <span className="font-medium text-slate-800">{skill.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">提供方 / API</span>
                <span className="font-medium text-slate-800">{skill.provider}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">鉴权方式</span>
                <span className="font-medium text-slate-800">{skill.auth}</span>
              </div>
            </div>
            
            <div className="mt-2 flex">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">配置鉴权参数 →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
