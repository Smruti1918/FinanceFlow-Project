
import React, { useState, useEffect } from 'react';
import { Page, UserProfile, Transaction, SavingGoal, PlanTier } from './types';
import LandingPage from './components/Landing';
import AuthPage from './components/Auth';
import PaymentPage from './components/Payment';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/Transactions';
import AnalyticsPage from './components/Analytics';
import SavingsPage from './components/SavingsGoals';
import SettingsPage from './components/Settings';
import HelpPage from './components/Help';
import EmailVerificationPage from './components/EmailVerification';
import { MOCK_STATS } from './constants';
import { auth, db } from './firebase';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [globalSearch, setGlobalSearch] = useState('');
  const [authInitialIsLogin, setAuthInitialIsLogin] = useState(true);
  const [pendingPlan, setPendingPlan] = useState<PlanTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('finance_flow_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('finance_flow_theme', theme);
  }, [theme]);

  // Reactive Stats Calculator
  const calculateStats = (transactions: Transaction[]) => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income' || tx.type === 'salary') income += tx.amount;
      else expenses += tx.amount;
    });
    return {
      totalBalance: income - expenses,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      netSavings: income - expenses
    };
  };

  // Auth & Live Firestore Transactions Listener
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubTransactions: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        if (fbUser.emailVerified) {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const transactionsRef = collection(db, 'users', fbUser.uid, 'transactions');
          const transactionsQuery = query(transactionsRef, orderBy('date', 'desc'));

          // Ensure basic profile exists
          unsubProfile = onSnapshot(userDocRef, (profileSnap) => {
            const profileData = profileSnap.exists() ? profileSnap.data() : {};
            
            setCurrentUser(prev => {
              const existingTransactions = prev?.transactions || [];
              return {
                id: fbUser.uid,
                fullName: fbUser.displayName || "Financial User",
                email: fbUser.email || "",
                avatar: fbUser.photoURL || "",
                planTier: 'Starter',
                savings: [],
                preferences: { currency: 'INR', privacyMode: false, twoFactorEnabled: false, language: 'English', timezone: 'UTC' },
                sessions: [{ id: 's1', device: 'Web Desktop', location: 'Cloud', lastActive: 'Now', isCurrent: true }],
                ...profileData,
                transactions: existingTransactions,
                stats: calculateStats(existingTransactions)
              } as UserProfile;
            });
            
            if (['landing', 'auth', 'email-verification'].includes(currentPage)) {
              setCurrentPage('dashboard');
            }
            setIsLoading(false);
          });

          unsubTransactions = onSnapshot(transactionsQuery, (txSnap) => {
            const txs: Transaction[] = [];
            txSnap.forEach((doc) => {
              txs.push({ ...doc.data(), id: doc.id } as Transaction);
            });
            
            setCurrentUser(prev => {
              if (!prev) return null;
              return {
                ...prev,
                transactions: txs,
                stats: calculateStats(txs)
              };
            });
            setIsLoading(false);
          });

        } else {
          setVerificationEmail(fbUser.email || "");
          setCurrentPage('email-verification');
          await signOut(auth);
          setIsLoading(false);
        }
      } else {
        setCurrentUser(null);
        setIsLoading(false);
        if (unsubProfile) unsubProfile();
        if (unsubTransactions) unsubTransactions();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProfile) unsubProfile();
      if (unsubTransactions) unsubTransactions();
    };
  }, [currentPage]);

  const handleUpdateUser = async (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.id);
    await setDoc(userDocRef, updatedData, { merge: true });
  };

  const handleAddTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (!currentUser) return;
    const txsRef = collection(db, 'users', currentUser.id, 'transactions');
    
    // Add the primary transaction
    await addDoc(txsRef, tx);

    // Automation: Cut 50% automatically if it's income
    if (tx.type === 'income' || tx.type === 'salary') {
      const sweepAmount = tx.amount * 0.5;
      const sweepTx: Omit<Transaction, 'id'> = {
        vendor: 'Auto Wealth Sweep',
        category: 'Automation',
        amount: sweepAmount,
        type: 'expense',
        date: tx.date || new Date().toISOString().split('T')[0],
        isAuto: true
      };
      // Add the automated offset
      await addDoc(txsRef, sweepTx);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!currentUser) return;
    const txRef = doc(db, 'users', currentUser.id, 'transactions', id);
    await deleteDoc(txRef);
  };

  const handleSmartRecord = async (text: string): Promise<{ success: boolean; message?: string }> => {
    if (!process.env.API_KEY) return { success: false, message: "AI Services Unavailable" };
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse this financial entry: "${text}". Format: JSON with vendor, category, amount (number), type (income/expense), date (YYYY-MM-DD). Today is ${new Date().toISOString().split('T')[0]}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendor: { type: Type.STRING },
              category: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              type: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["vendor", "category", "amount", "type", "date"]
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      await handleAddTransaction(result);
      return { success: true };
    } catch (err) {
      return { success: false, message: "AI could not verify transaction details." };
    }
  };

  const handleLogin = async (email: string, password?: string, rememberMe: boolean = false, fullName?: string, avatar?: string): Promise<{ success: boolean, message?: string }> => {
    try {
      if (fullName) {
        // Registration Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password || '');
        await updateProfile(userCredential.user, { displayName: fullName, photoURL: avatar });
        
        await sendEmailVerification(userCredential.user);
        setVerificationEmail(email);
        await signOut(auth);
        setCurrentPage('email-verification');
        return { success: true };
      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password || '');
        return { success: true };
      }
    } catch (error: any) {
      if (fullName && error.code === 'auth/email-already-in-use') {
        return { success: false, message: "User already exists. Sign in?" };
      }
      return { success: false, message: "Password or Email Incorrect" };
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('landing');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">FinanceFlow Secure Initialization</p>
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage === 'landing' && !currentUser) return <LandingPage onSignUp={() => { setAuthInitialIsLogin(false); setCurrentPage('auth'); }} onSignIn={() => { setAuthInitialIsLogin(true); setCurrentPage('auth'); }} onSelectPlan={(p) => { setPendingPlan(p); setAuthInitialIsLogin(false); setCurrentPage('auth'); }} />;
    if (currentPage === 'auth' && !currentUser) return <AuthPage initialIsLogin={authInitialIsLogin} onLogin={handleLogin} onResetPassword={async (e) => { await sendPasswordResetEmail(auth, e); return { success: true }; }} onCancel={() => setCurrentPage('landing')} />;
    if (currentPage === 'email-verification') return <EmailVerificationPage email={verificationEmail} onGoToLogin={() => { setAuthInitialIsLogin(true); setCurrentPage('auth'); }} />;
    if (currentPage === 'payment' && currentUser) return <PaymentPage plan={pendingPlan || 'Professional'} onSuccess={() => { handleUpdateUser({ planTier: pendingPlan || 'Professional' }); setPendingPlan(null); setCurrentPage('dashboard'); }} onCancel={() => setCurrentPage('dashboard')} />;
    if (!currentUser) return null;

    return (
      <Layout activePage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} user={currentUser} theme={theme} onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} searchValue={globalSearch} onSearchChange={setGlobalSearch}>
        {renderPage()}
      </Layout>
    );
  };

  const renderPage = () => {
    if (!currentUser) return null;
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={currentUser} onNavigate={setCurrentPage} onSmartRecord={handleSmartRecord} />;
      case 'transactions': return <TransactionsPage user={currentUser} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} externalSearch={globalSearch} />;
      case 'analytics': return <AnalyticsPage user={currentUser} />;
      case 'savings': return (
        <SavingsPage 
          user={currentUser} 
          onAddGoal={(g) => handleUpdateUser({ savings: [...currentUser.savings, g] })} 
          onDeleteGoal={(id) => handleUpdateUser({ savings: currentUser.savings.filter(s => s.id !== id) })} 
          onUpdateGoal={(g) => handleUpdateUser({ savings: currentUser.savings.map(s => s.id === g.id ? g : s) })} 
          onContribute={(id, amt) => {
            const goal = currentUser.savings.find(s => s.id === id);
            if (!goal) return;
            const updated = currentUser.savings.map(g => g.id === id ? { ...g, current: g.current + amt } : g);
            handleUpdateUser({ savings: updated });
            // Record a transaction so it gets deducted from balance and tracked in ledger
            handleAddTransaction({
              vendor: `Saving: ${goal.name}`,
              category: 'Savings',
              amount: amt,
              type: 'expense',
              date: new Date().toISOString().split('T')[0]
            });
          }} 
        />
      );
      case 'settings': return <SettingsPage user={currentUser} onUpdateUser={handleUpdateUser} onDeleteAccount={async () => { await deleteDoc(doc(db, 'users', currentUser.id)); if (auth.currentUser) await deleteUser(auth.currentUser); handleLogout(); }} />;
      case 'help': return <HelpPage />;
      default: return <Dashboard user={currentUser} onNavigate={setCurrentPage} onSmartRecord={handleSmartRecord} />;
    }
  };

  return <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">{renderContent()}</div>;
};

export default App;
