/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { AGENTS as INITIAL_AGENTS, NAVIGATION } from './constants';
import { cn } from './lib/utils';
import { LayoutDashboard, LogOut, Settings, ChevronDown } from 'lucide-react';
import DashboardView from './components/DashboardView';
import ArchitectureView from './components/ArchitectureView';
import AgentsView from './components/AgentsView';
import SkillsView from './components/SkillsView';
import KnowledgeView from './components/KnowledgeView';
import ChatView from './components/ChatView';

const BRANDINGS = [
  { id: 'ruijian', name: '睿鉴', mascot: '🦅', bgColor: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', desc: '深度审查与研判平台' },
  { id: 'haidun', name: '海盾', mascot: '🛡️', bgColor: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', desc: '公共案事件防护屏障' },
  { id: 'zhishu', name: '智枢', mascot: '🐙', bgColor: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', desc: '多智能体协同中枢' },
  { id: 'ruitong', name: '睿瞳', mascot: '👁️', bgColor: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', desc: '全域数据取证天眼' }
];

export default function App() {
  const [activeBrand, setActiveBrand] = useState(BRANDINGS[0]);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [activeView, setActiveView] = useState('chat');
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowBrandMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView agents={agents} />;
      case 'architecture': return <ArchitectureView />;
      case 'agents': return <AgentsView agents={agents} setAgents={setAgents} />;
      case 'skills': return <SkillsView />;
      case 'knowledge': return <KnowledgeView />;
      case 'chat': return <ChatView agents={agents} />;
      default: return <DashboardView agents={agents} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 relative z-20">
        <div className="p-4 border-b border-slate-100 relative" ref={menuRef}>
          <button 
            className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
            onClick={() => setShowBrandMenu(!showBrandMenu)}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border", activeBrand.bgColor, activeBrand.border)}>
                <span className="transform -translate-y-px">{activeBrand.mascot}</span>
              </div>
              <div className="text-left">
                <h1 className="text-base font-bold tracking-tight text-slate-800">{activeBrand.name}</h1>
                <p className="text-[10px] text-slate-400 font-medium truncate w-32">{activeBrand.desc}</p>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showBrandMenu ? "rotate-180" : "")} />
          </button>

          {showBrandMenu && (
            <div className="absolute top-[76px] left-4 right-4 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              {BRANDINGS.map(brand => (
                <button 
                  key={brand.id}
                  onClick={() => { setActiveBrand(brand); setShowBrandMenu(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left", 
                    brand.id === activeBrand.id ? "bg-slate-50" : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm border shrink-0", brand.bgColor, brand.border)}>
                    {brand.mascot}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{brand.name}</div>
                    <div className="text-[10px] text-slate-500">{brand.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeView === item.id 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4", 
                activeView === item.id ? "text-indigo-600" : "text-slate-400"
              )} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors mb-2">
            <Settings className="w-4 h-4 text-slate-400" />
            系统设置
          </button>
          <div className="flex items-center justify-between px-3 text-xs text-slate-400 font-mono">
            <span>v2.4.1-rc</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        <div className="h-full overflow-y-auto w-full p-8">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
}
