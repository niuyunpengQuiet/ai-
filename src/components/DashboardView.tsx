import { Activity, Book, Box, Terminal, TrendingUp, Users } from 'lucide-react';
import { KNOWLEDGE_BASES, SKILLS } from '../constants';

function StatCard({ title, value, subtitle, icon: Icon, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-700" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-slate-800">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium flex items-center ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardView({ agents }: { agents: any[] }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">系统总览</h2>
        <p className="text-slate-500 mt-2">实时监控多智能体调度与资源状态。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="活跃智能体" value={agents.length} subtitle="较上周" icon={Terminal} trend={12} />
        <StatCard title="插拔式技能" value={SKILLS.length} subtitle="已挂载至集群" icon={Box} trend={8} />
        <StatCard title="知识库总切片" value={KNOWLEDGE_BASES.reduce((a,b)=>a+b.docs,0).toLocaleString()} subtitle="向量库检索就绪" icon={Book} trend={24} />
        <StatCard title="编排调度 QPS" value="1,248" subtitle="请求并发量" icon={Activity} trend={-3} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border border-slate-200 bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800">分层路由请求量 (7天)</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">更新时间: 刚刚</span>
          </div>
          <div className="h-64 flex items-end gap-2 border-b border-l border-slate-100 pb-2 pl-2">
            {/* Fake chart bars */}
            {[40, 60, 45, 80, 50, 90, 75, 40, 60, 85, 70, 95, 60, 50, 80].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 justify-end h-full group">
                <div 
                  className="w-full bg-indigo-500/20 rounded-t-sm group-hover:bg-indigo-500/40 transition-colors" 
                  style={{ height: `${v}%` }}
                >
                  <div className="w-full bg-indigo-600 rounded-t-sm" style={{ height: `${v * 0.4}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div>小模型 Router</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>大模型 / 专家 Worker</div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-6">实时编排审计</h3>
          <div className="space-y-4">
            {[
              { title: "Router -> 经济犯罪研判专家", desc: "由于存在资金流向分析诉求，正在切换专家实体", time: "2分钟前", status: "智能路由" },
              { title: "Supervisor -> 涉毒案件侦查专家", desc: "发现不明黑话，拉取暗语库辅助研判", time: "5分钟前", status: "挂载成功" },
              { title: "Gateway -> Router", desc: "快速处理普通的问询请求", time: "12分钟前", status: "即时响应" },
              { title: "Query Vector DB", desc: "正在查询「刑法与相关司法解释」进行定罪判断", time: "18分钟前", status: "RAG 融合" }
            ].map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{log.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
