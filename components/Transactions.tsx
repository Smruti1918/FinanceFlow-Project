
import React, { useState } from 'react';
import { Search, Filter, Download, Plus, TrendingUp, TrendingDown, Calendar, X, Trash2, Zap, Bot } from 'lucide-react';
import { formatCurrency } from '../constants';
import { UserProfile, Transaction } from '../types';

interface TransactionsPageProps {
  user: UserProfile;
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (txId: string) => void;
  externalSearch?: string;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ user, onAddTransaction, onDeleteTransaction, externalSearch = '' }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const activeSearch = externalSearch || localSearchTerm;

  const filteredTransactions = user.transactions.filter(t => {
    const matchesSearch = t.vendor.toLowerCase().includes(activeSearch.toLowerCase()) ||
                          t.category.toLowerCase().includes(activeSearch.toLowerCase());
    const txDate = new Date(t.date);
    const matchesStartDate = !startDate || txDate >= new Date(startDate);
    const matchesEndDate = !endDate || txDate <= new Date(endDate);
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now().toString(),
      vendor,
      category,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0],
      isAuto: false
    };
    onAddTransaction(newTx);
    setIsModalOpen(false);
    setVendor(''); setCategory(''); setAmount('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage your financial movements with precision.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-4 shadow-sm transition-colors duration-300">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
            value={activeSearch}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-500 dark:text-slate-400 font-bold transition-all">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" className="bg-transparent border-none focus:ring-0 p-0 text-slate-700 dark:text-slate-200" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className="opacity-30">to</span>
            <input type="date" className="bg-transparent border-none focus:ring-0 p-0 text-slate-700 dark:text-slate-200" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          {(activeSearch || startDate || endDate) && (
            <button onClick={() => {setLocalSearchTerm(''); setStartDate(''); setEndDate('');}} className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors" title="Clear Filters"><X size={20} /></button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Entry Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group ${tx.isAuto ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        tx.type === 'income' || tx.type === 'salary' 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700'
                      }`}>
                        {tx.isAuto ? <Bot size={18} /> : (tx.type === 'income' || tx.type === 'salary' ? <TrendingUp size={18} /> : <TrendingDown size={18} />)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{tx.vendor}</span>
                           {tx.isAuto && (
                             <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase rounded tracking-widest border border-indigo-200 dark:border-indigo-800">
                               <Zap size={8} className="fill-current" />
                               Auto
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">{tx.category}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-400 dark:text-slate-500">{tx.date}</td>
                  <td className={`px-8 py-5 text-right text-sm font-black ${tx.type === 'income' || tx.type === 'salary' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {tx.type === 'income' || tx.type === 'salary' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="p-24 text-center">
             <div className="flex flex-col items-center">
                <Search size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                <p className="text-slate-400 dark:text-slate-600 font-bold italic">No matching transactions found.</p>
             </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
              <h3 className="text-2xl font-black tracking-tight">Add New Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all">
                <button type="button" onClick={() => setType('expense')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500'}`}>EXPENSE</button>
                <button type="button" onClick={() => setType('income')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'}`}>INCOME</button>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Vendor/Payor</label>
                  <input required value={vendor} onChange={e => setVendor(e.target.value)} type="text" placeholder="e.g. Amazon, Employer" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <input required value={category} onChange={e => setCategory(e.target.value)} type="text" placeholder="e.g. Food" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                    <input required value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="0.00" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-600" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95">
                Confirm Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;