
import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  Receipt,
  Crown,
  Zap,
  Star,
  Sparkles,
  Send,
  Loader2,
  Target,
  CheckCircle,
  Info,
  Bot
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatRawCurrency } from '../constants';
import { UserProfile, Page } from '../types';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (page: Page) => void;
  onSmartRecord: (text: string) => Promise<{ success: boolean; message?: string }>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onSmartRecord }) => {
  const [smartInput, setSmartInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const privacyMode = user.preferences?.privacyMode;
  const currency = user.preferences?.currency || 'INR';
  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';

  // Real-time Chart Data Generation based on Transaction History
  const dynamicChartData = useMemo(() => {
    if (user.transactions.length === 0) return [];
    
    const groups: Record<string, { income: number; expense: number }> = {};
    
    // Sort transactions by date
    const sorted = [...user.transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(tx => {
      const date = new Date(tx.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!groups[month]) groups[month] = { income: 0, expense: 0 };
      if (tx.type === 'income' || tx.type === 'salary') groups[month].income += tx.amount;
      else groups[month].expense += tx.amount;
    });

    return Object.entries(groups).map(([name, data]) => ({
      name,
      inflow: data.income,
      outflow: data.expense,
      net: data.income - data.expense
    })).slice(-6); // Last 6 months
  }, [user.transactions]);

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim() || isAiThinking) return;
    setIsAiThinking(true);
    const result = await onSmartRecord(smartInput);
    setIsAiThinking(false);
    if (result.success) setSmartInput('');
    else alert(result.message);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span>
            </h1>
            <PlanBadge tier={user.planTier} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2">
            Cloud sync active. Your wealth engine is performing optimally.
          </p>
        </div>
      </div>

      {/* AI Smart Record Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] p-6 shadow-xl shadow-indigo-500/5 group transition-all hover:border-indigo-500/50">
        <form onSubmit={handleSmartSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
            <Sparkles size={24} />
          </div>
          <div className="flex-1 w-full relative">
            <input 
              type="text"
              value={smartInput}
              onChange={(e) => setSmartInput(e.target.value)}
              placeholder="Record with AI (e.g. 'Spent 500 on coffee')"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none outline-none py-4 px-6 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
              disabled={isAiThinking}
            />
            {isAiThinking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Syncing...</span>
              </div>
            )}
          </div>
          <button 
            type="submit"
            disabled={!smartInput.trim() || isAiThinking}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <span>Log with AI</span>
            <Send size={16} />
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Liquidity" 
          value={formatCurrency(user.stats.totalBalance, currency)} 
          rawValue={formatRawCurrency(user.stats.totalBalance, currency)}
          privacy={privacyMode} 
          icon={Wallet} 
          color="text-indigo-600"
          description="Your current spendable balance across all accounts. Formula: (Total Inflow - Total Outflow)."
        />
        <StatCard 
          title="Total Inflow" 
          value={formatCurrency(user.stats.monthlyIncome, currency)} 
          rawValue={formatRawCurrency(user.stats.monthlyIncome, currency)}
          privacy={privacyMode} 
          icon={TrendingUp} 
          color="text-emerald-600"
          description="Gross lifetime earnings. This tracks every rupee that has ever entered your ecosystem as Income."
        />
        <StatCard 
          title="Total Outflow" 
          value={formatCurrency(user.stats.monthlyExpenses, currency)} 
          rawValue={formatRawCurrency(user.stats.monthlyExpenses, currency)}
          privacy={privacyMode} 
          icon={TrendingDown} 
          color="text-rose-600"
          description="Total expenditures, including lifestyle costs and money committed to Savings Goals."
        />
        <StatCard 
          title="Savings Rate" 
          value={user.stats.monthlyIncome > 0 ? `${Math.round((user.stats.netSavings / user.stats.monthlyIncome) * 100)}%` : '0%'} 
          icon={PieChart} 
          color="text-amber-600"
          description="Financial Efficiency Score: The % of income you KEEP. Formula: (Net Savings / Total Inflow) x 100."
        />
      </div>

      {/* Wealth Goals Preview Section */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Wealth Milestones</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct Goal Tracking</p>
          </div>
          <button 
            onClick={() => onNavigate('savings')}
            className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
          >
            <span>Manage All</span>
            <Target size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.savings.slice(0, 4).map(goal => {
            const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isCompleted = goal.current >= goal.target;
            return (
              <div key={goal.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${goal.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Target size={18} />
                  </div>
                  {isCompleted && <CheckCircle size={16} className="text-emerald-500" />}
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate mb-1">{goal.name}</h4>
                <div className="flex items-end justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {percentage}% Reach
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(goal.current, currency)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          {user.savings.length === 0 && (
            <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
              <Target size={24} className="text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active goals found</p>
              <button onClick={() => onNavigate('savings')} className="mt-3 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Set First Milestone</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm transition-all hover:shadow-indigo-500/10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Performance Chart</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cash Flow & Inflow Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Outflow</span>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full">
             {dynamicChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicChartData}>
                    <defs>
                      <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} hide={privacyMode} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="inflow" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorInflow)" />
                    <Area type="monotone" dataKey="outflow" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorOutflow)" />
                  </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <PieChart size={48} className="opacity-20 mb-4" />
                 <p className="text-sm font-bold opacity-50">Log transactions to visualize performance</p>
               </div>
             )}
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm transition-all hover:shadow-indigo-500/10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Ledger</h3>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-8 min-h-[300px]">
            {user.transactions.length > 0 ? (
              user.transactions.slice(0, 7).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('transactions')}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      tx.type === 'income' || tx.type === 'salary' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {tx.isAuto ? <Bot size={20} /> : (tx.type === 'income' || tx.type === 'salary' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{tx.vendor}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.category}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black tracking-tighter ${tx.type === 'income' || tx.type === 'salary' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === 'income' || tx.type === 'salary' ? '+' : '-'}{privacyMode ? '••••' : formatCurrency(tx.amount, currency)}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center pt-16 opacity-40">
                <Receipt size={32} className="mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Cloud Records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanBadge = ({ tier }: { tier: string }) => {
  if (tier === 'Professional') {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-900/30 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
        <Crown size={12} />
        <span>Professional</span>
      </div>
    );
  }
  if (tier === 'Enterprise') {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
        <Zap size={12} />
        <span>Enterprise</span>
      </div>
    );
  }
  return (
    <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest">
      <Star size={12} />
      <span>Starter</span>
    </div>
  );
};

const StatCard = ({ title, value, rawValue, privacy, icon: Icon, color, description }: any) => (
  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group relative">
    <div className="flex items-center justify-between mb-6">
      <div className={`w-12 h-12 rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 ${color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon size={24} />
      </div>
      <div className="relative group/tooltip">
        <Info size={14} className="text-slate-300 hover:text-indigo-500 transition-colors cursor-help" />
        <div className="absolute bottom-full right-0 mb-3 w-48 p-4 bg-slate-900 text-white text-[10px] font-bold rounded-2xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
          {description}
        </div>
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <div className="relative group/value">
      <h3 className={`text-3xl font-black text-slate-900 dark:text-white tracking-tighter ${privacy ? 'blur-sensitive' : ''}`}>
        {privacy ? '••••' : value}
      </h3>
      {!privacy && rawValue && (
        <div className="absolute top-full left-0 mt-1 opacity-0 group-hover/value:opacity-100 transition-opacity whitespace-nowrap bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg z-10 uppercase tracking-widest">
          Exact: {rawValue}
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;