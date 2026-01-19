
import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency } from '../constants';
import { UserProfile } from '../types';

interface AnalyticsPageProps {
  user: UserProfile;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ user }) => {
  const categoryData = useMemo(() => {
    const expenses = user.transactions.filter(t => t.type === 'expense');
    const categoryMap: Record<string, number> = {};
    expenses.forEach(tx => categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount);
    return Object.entries(categoryMap).map(([name, value], index) => ({
      name, value, color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);
  }, [user.transactions]);

  // Generate trend data from transactions
  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dailyExpenses = user.transactions
        .filter(t => t.date === date && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyIncome = user.transactions
        .filter(t => t.date === date && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: date.split('-').slice(1).join('/'),
        expenses: dailyExpenses,
        income: dailyIncome
      };
    });
  }, [user.transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Visual breakdown of your financial health and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Spending by Category</h3>
          <div className="h-80 w-full relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ outline: 'none' }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    style={{ outline: 'none' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      color: '#0f172a',
                      border: 'none', 
                      borderRadius: '16px', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontWeight: '700', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 italic">No expense data available.</div>
            )}
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <InsightCard label="Savings Rate" value={`${user.stats.monthlyIncome > 0 ? Math.round((user.stats.netSavings / user.stats.monthlyIncome) * 100) : 0}%`} color="text-indigo-600 dark:text-indigo-400" bg="bg-indigo-50 dark:bg-indigo-900/20" />
           <InsightCard label="Top Category" value={categoryData[0]?.name || 'N/A'} color="text-rose-600 dark:text-rose-400" bg="bg-rose-50 dark:bg-rose-900/20" />
           <InsightCard label="Avg Daily Spend" value={formatCurrency(Math.round(user.stats.monthlyExpenses / 30))} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
           <InsightCard label="Monthly Net" value={formatCurrency(user.stats.netSavings)} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-900/20" />
        </div>
      </div>

      {/* Expense Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Expense Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Past 7 Days Output</p>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
                }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={2000}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={2000}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ label, value, color, bg }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
    <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-4 font-bold text-xs`}>📊</div>
    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
    <h4 className={`text-xl font-black mt-1 tracking-tight ${color}`}>{value}</h4>
  </div>
);

export default AnalyticsPage;
