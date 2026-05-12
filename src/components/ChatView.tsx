import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Settings2, Sparkles, Zap, Loader2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ChatView({ agents }: { agents: any[] }) {
  const [selectedAgentIds, setSelectedAgentIds] = useState<Record<string, number>>({
    [agents[0]?.id]: 80
  });
  const [interactionMode, setInteractionMode] = useState<'stream' | 'sync' | 'cot'>('stream');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent' | 'system'; content: string; cot?: string }[]>([
    { role: 'system', content: '您好，交互工作台已就绪。支持多智能体节点同时挂载（MoE路由）。请在右侧选择相关办案专家并配置决策权重。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleToggleAgent = (id: string) => {
    setSelectedAgentIds(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = 50;
      }
      return next;
    });
  };

  const handleChangeWeight = (id: string, weight: number) => {
    setSelectedAgentIds(prev => ({ ...prev, [id]: weight }));
  };

  const generateMockResponse = (inputText: string) => {
    const activeAgents = agents.filter(a => selectedAgentIds[a.id] !== undefined);
    
    // Create specific business scenarios based on active agents
    const ids = activeAgents.map(a => a.id);
    let mockResponse = '';
    let mockCot = '';

    if (ids.includes('agt-eco-02') && ids.includes('agt-drug-03')) {
       // Economy + Drug
       mockCot = '1. [意图路由] 检查到混合目标：资金流向分析与暗语溯源。\n2. [权重分配] 经济犯罪研判专家 (权重: ' + selectedAgentIds['agt-eco-02'] + '%), 涉毒侦查专家 (权重: ' + selectedAgentIds['agt-drug-03'] + '%)\n3. [数据调度] Elasticsearch并发检索洗钱模型库, Python脚本执行微信聊天记录脱敏与黑话抽取。\n4. [综合生成] Plan-and-Solve策略联合输出。';
       mockResponse = '联合研判分析报告：\n\n【资金流特征提取 (经侦专家节点)】\n通过检索涉案账户 (ID: 4403**********1023)，发现高度疑似地下钱庄的对倒交易特征，大额资金在深夜呈“快进快出”规律，高度吻合洗钱操作。\n\n【审讯与微信通联分析 (禁毒专家节点)】\n对提取的聊天记录进行数据治理后，“溜冰”、“开板”、“肉子”等黑话共计出现 14 次。资金规律与这些暗语出现的时间点高度重合（误差<2小时），证实了隐蔽的线上毒资交易网络。';
    } else if (ids.includes('agt-eco-02')) {
       mockCot = '1. [意图路由] 分发至经济犯罪研判专家。\n2. [技能挂载] 激活ES检索与MySQL查询技能 (sk-mysql-query)。\n3. [聚合] 分析资金流水表与企业图谱。';
       mockResponse = '经查询资金链路数据库：\n目标公司“xx商贸有限公司”近半年无实际发票项，但存在多笔频繁的小额对公转账（单笔 < 4.9万）。\n研判结论：典型的分布式洗钱特征。建议立即对下游 13 个接收账户执行流水冻结和穿透审查。';
    } else if (ids.includes('agt-data-04')) {
       mockCot = '1. [意图路由] 分发至电子数据取证专家。\n2. [技能挂载] 激活语音翻译 (sk-voice-trans) 与图文OCR。\n3. [校验] 符合电子取证操作规范。';
       mockResponse = '正在执行非结构化数据解析：\n上传的 3 份语音文件已转换完毕。由于涉及方言，已加载专门的方言声学模型。翻译结果显示，嫌疑人提到了“把东西藏在老地方的车库”。涉案证据的 hash 值已进行区块链固证。';
    } else {
       mockCot = '1. [意图路由] 正在评估请求意图。\n2. [响应分发] 路由至配置的首选专家池。\n3. [上下文合并] 整合各节点信息片段。';
       mockResponse = `收到指令：“${inputText}”\n已调用相关智能体知识库进行比对分析。根据刑法及相关司法解释，该行为的构成要件已初步分析完成。如需更深度的研判，请调整智能体权重。`;
    }

    return { mockResponse, mockCot };
  };

  const simulateStream = (text: string, cot?: string) => {
    let currentText = '';
    const chunkLength = 3;
    let i = 0;
    
    // Add empty message first
    setMessages(prev => [...prev, { role: 'agent', content: '', cot }]);
    
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        return;
      }
      currentText += text.substring(i, i + chunkLength);
      i += chunkLength;
      
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: currentText };
        return next;
      });
    }, 30);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    const { mockResponse, mockCot } = generateMockResponse(userMessage);

    setTimeout(() => {
      setIsTyping(false);
      if (interactionMode === 'stream' || interactionMode === 'cot') {
        simulateStream(mockResponse, interactionMode === 'cot' ? mockCot : undefined);
      } else {
        setMessages(prev => [...prev, { 
          role: 'agent', 
          content: mockResponse,
          cot: interactionMode === 'cot' ? mockCot : undefined
        }]);
      }
    }, 800);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-serif italic text-slate-400">交互调试工作台</h2>
          <p className="text-slate-500 mt-1 text-sm">动态切换目标智能体，并测试不同交互模式的响应效果。</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Top Info Bar */}
          <div className="h-14 border-b border-slate-100 flex items-center px-6 justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-800">MoE 混合专家研判</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{Object.keys(selectedAgentIds).length} 个智能体节点协同中</p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
              当前交互会话: {interactionMode.toUpperCase()}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                {msg.role !== 'system' && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    {msg.role === 'user' ? <div className="w-4 h-4 rounded-full bg-slate-400" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                  </div>
                )}
                <div className={cn("flex flex-col gap-2 w-full", msg.role === 'user' ? "items-end" : "items-start")}>
                  {msg.cot && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-500 whitespace-pre-wrap w-full shadow-inner">
                      <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-600">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        系统思维链 (CoT Trace)
                      </div>
                      {msg.cot}
                    </div>
                  )}
                  {msg.role === 'system' ? (
                     <div className="text-xs text-center text-slate-400 w-full mb-2">{msg.content}</div>
                  ) : (
                    <div className={cn(
                      "p-3 rounded-xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm w-fit",
                      msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-700"
                    )}>
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="在此输入您的问题或案件线索..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
               >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-3 px-1">
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 回车发送请求
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Settings2 className="w-3 h-3" /> 当前模式：{interactionMode === 'stream' ? '流式输出' : interactionMode === 'sync' ? '同步响应' : '思维链推理'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Settings Sidebar */}
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 pb-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">目标智能体 (MoE 多选与权重)</h3>
            <div className="space-y-3">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border flex flex-col gap-2 transition-all",
                    selectedAgentIds[agent.id] !== undefined 
                      ? "bg-slate-50 border-indigo-200 ring-1 ring-indigo-500/50" 
                      : "bg-white border-slate-100 hover:border-slate-300"
                  )}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={cn("mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0", selectedAgentIds[agent.id] !== undefined ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300")}>
                      {selectedAgentIds[agent.id] !== undefined && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedAgentIds[agent.id] !== undefined}
                      onChange={() => handleToggleAgent(agent.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 truncate">{agent.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{agent.id}</div>
                    </div>
                  </label>

                  {selectedAgentIds[agent.id] !== undefined && (
                    <div className="pl-7 pr-1 mt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>决策权重系数</span>
                        <span className="font-mono bg-white border border-slate-200 px-1 rounded">{selectedAgentIds[agent.id]}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={selectedAgentIds[agent.id]} 
                        onChange={(e) => handleChangeWeight(agent.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">响应交互模式</h3>
             <div className="flex flex-col gap-2">
               <button 
                 onClick={() => setInteractionMode('stream')}
                 className={cn("flex items-center gap-3 p-2 rounded text-sm transition-colors", interactionMode === 'stream' ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50")}
               >
                 <Zap className="w-4 h-4 text-amber-500" />
                 流式输出 (Streaming)
               </button>
               <button 
                 onClick={() => setInteractionMode('sync')}
                 className={cn("flex items-center gap-3 p-2 rounded text-sm transition-colors", interactionMode === 'sync' ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50")}
               >
                 <Bot className="w-4 h-4 text-emerald-500" />
                 同步响应 (Sync)
               </button>
               <button 
                 onClick={() => setInteractionMode('cot')}
                 className={cn("flex items-center gap-3 p-2 rounded text-sm transition-colors", interactionMode === 'cot' ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50")}
               >
                 <Sparkles className="w-4 h-4 text-purple-500" />
                 带思维链 (CoT)
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
