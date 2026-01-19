
export type TransactionType = 'income' | 'expense' | 'salary' | 'transfer';
export type PlanTier = 'Starter' | 'Professional' | 'Enterprise';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  vendor: string;
  amount: number;
  date: string;
  isAuto?: boolean;
}

export interface SavingGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
}

export interface UserPreferences {
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  privacyMode: boolean;
  twoFactorEnabled: boolean;
  language: string;
  timezone: string;
}

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  password?: string;
  avatar?: string;
  planTier: PlanTier;
  stats: DashboardStats;
  transactions: Transaction[];
  savings: SavingGoal[];
  preferences: UserPreferences;
  sessions: SecuritySession[];
}

export type Page = 'landing' | 'auth' | 'payment' | 'dashboard' | 'transactions' | 'analytics' | 'savings' | 'settings' | 'help' | 'email-verification';