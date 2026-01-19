import React, { useState } from 'react';
import { Target, Plus, X, Edit3, Trash2, Coins, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../constants';
import { UserProfile, SavingGoal } from '../types';

interface SavingsPageProps {
  user: UserProfile;
  onAddGoal: (goal: SavingGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onUpdateGoal: (goal: SavingGoal) => void;
  onContribute: (goalId: string, amount: number) => void;
}

const SavingsPage: React.FC<SavingsPageProps> = ({ user, onAddGoal, onDeleteGoal, onUpdateGoal, onContribute }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [color, setColor] = useState('bg-indigo-600');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: SavingGoal = {
      id: Date.now().toString(),
      name,
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      color
    };
    onAddGoal(newGoal);
    setIsModalOpen(false);
    setName(''); setTarget(''); setCurrent('');
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeGoalId && contributionAmount) {
      onContribute(activeGoalId, parseFloat(contributionAmount));
      setIsContributeModalOpen(false);
      setContributionAmount('');
      setActiveGoalId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Savings & Goals</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Plan and track your long-term financial milestones.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.savings.map(goal => {
          const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const isCompleted = goal.current >= goal.target;

          return (
            <div key={goal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${goal.color.includes('bg-') ? goal.color : 'bg-indigo-600'} shadow-sm`}>
                  <Target size={24} />
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isCompleted && (
                    <button 
                      onClick={() => { setActiveGoalId(goal.id); setIsContributeModalOpen(true); }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                      title="Add Money"
                    >
                      <Coins size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{goal.name}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium uppercase tracking-wider">Target: {formatCurrency(goal.target)}</p>

              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(goal.current)}</span>
                <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'} px-2 py-1 rounded-full`}>{percentage}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${goal.color.includes('bg-') ? goal.color : 'bg-indigo-600'} ${isCompleted ? 'bg-emerald-500' : ''}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {isCompleted && (
                <div className="mt-6 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-500">
                  <CheckCircle size={14} className="animate-pulse" />
                  <span>Goal Completed</span>
                </div>
              )}
            </div>
          );
        })}
        
        {user.savings.length === 0 && (
          <div className="md:col-span-3 text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
             <Target size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
             <p className="text-slate-500 dark:text-slate-400 font-bold">No active goals found.</p>
             <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-2">Create your first goal</button>
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
              <h3 className="text-xl font-bold tracking-tight">New Goal Strategy</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">Goal Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. New Home" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">Target</label>
                    <input required value={target} onChange={e => setTarget(e.target.value)} type="number" placeholder="50000" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">Current</label>
                    <input value={current} onChange={e => setCurrent(e.target.value)} type="number" placeholder="0" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95">
                Initialize Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {isContributeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="text-xl font-bold tracking-tight">Add Funds</h3>
              <button onClick={() => setIsContributeModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleContributeSubmit} className="p-8 space-y-6">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                  <Coins size={32} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enter the amount you'd like to contribute to this goal.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">Amount</label>
                <input 
                  autoFocus
                  required 
                  value={contributionAmount} 
                  onChange={e => setContributionAmount(e.target.value)} 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold dark:text-white text-center" 
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all active:scale-95">
                Confirm Contribution
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsPage;