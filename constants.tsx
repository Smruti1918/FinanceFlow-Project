
import { Transaction, SavingGoal, DashboardStats } from './types';

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  
  const absAmount = Math.abs(amount);
  
  // Professional precision: Show 2 decimal places for large numbers to see transaction movement
  if (absAmount >= 1000000) {
    return `${amount < 0 ? '-' : ''}${symbol}${(absAmount / 1000000).toFixed(2)}M`;
  }
  if (absAmount >= 1000) {
    return `${amount < 0 ? '-' : ''}${symbol}${(absAmount / 1000).toFixed(2)}K`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatRawCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const MOCK_TRANSACTIONS: Transaction[] = [];

export const MOCK_STATS: DashboardStats = {
  totalBalance: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  netSavings: 0
};

export const MOCK_SAVINGS: SavingGoal[] = [];

export const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 0, expenses: 0 },
  { name: 'Feb', revenue: 0, expenses: 0 },
  { name: 'Mar', revenue: 0, expenses: 0 },
  { name: 'Apr', revenue: 0, expenses: 0 },
  { name: 'May', revenue: 0, expenses: 0 },
  { name: 'Jun', revenue: 0, expenses: 0 },
];
