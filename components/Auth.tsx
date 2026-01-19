import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, Camera } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, password?: string, rememberMe?: boolean, fullName?: string, avatar?: string) => Promise<{ success: boolean, message?: string }>;
  onResetPassword: (email: string) => Promise<{ success: boolean, message?: string }>;
  onCancel: () => void;
  initialIsLogin?: boolean;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'reset-sent';

const AuthPage: React.FC<AuthProps> = ({ onLogin, onResetPassword, onCancel, initialIsLogin = true }) => {
  const [view, setView] = useState<AuthView>(initialIsLogin ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setView(initialIsLogin ? 'login' : 'signup');
  }, [initialIsLogin]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (view === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const isLoggingIn = view === 'login';
    const result = await onLogin(email, password, rememberMe, isLoggingIn ? undefined : fullName, isLoggingIn ? undefined : avatar);
    
    if (!result.success) {
      setError(result.message);
      // Requirement: Lead them to the 'Sign in' form if user exists
      if (result.message === "User already exists. Sign in?") {
        // We stay on signup view but show error with "Sign in instead" link
      }
    }
    
    setIsSubmitting(false);
  };

  const renderView = () => {
    if (view === 'reset-sent') {
      return (
        <div className="p-10 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[2.5rem] mb-8 shadow-sm">
            <Mail size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">Check your Inbox</h2>
          <button 
            onClick={() => setView('login')}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
          >
            Sign In
          </button>
        </div>
      );
    }

    return (
      <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-6 font-bold text-2xl shadow-lg">F</div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join FinanceFlow' : 'Reset Password'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {view === 'login' ? 'Securely access your wealth dashboard' : view === 'signup' ? 'Start your journey to financial freedom' : 'Recover your account access'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 border rounded-2xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 ${
            error === "User already exists. Sign in?" 
            ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400' 
            : 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
          }`}>
            <AlertCircle className="shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">{error}</p>
              {error === "User already exists. Sign in?" && (
                <button 
                  onClick={() => setView('login')}
                  className="text-xs font-black underline mt-2 uppercase tracking-widest text-indigo-600"
                >
                  Sign In Now
                </button>
              )}
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {view === 'signup' && (
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl transition-all group-hover:scale-105">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" alt="Profile preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                  <Camera size={14} />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Upload Profile Photo</p>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g., Alex Rivers" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold dark:text-white"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold dark:text-white"
              />
            </div>
          </div>

          {view !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => { setView('forgot'); setError(null); }}
                    className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold dark:text-white"
                />
              </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Repeat Password</label>
              <div className="relative">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-700 shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Recover Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">
            {view === 'login' ? "Don't have an account?" : "Already a member?"}{' '}
            <button 
              onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-indigo-600 font-black hover:underline ml-1"
            >
              {view === 'login' ? 'Register Now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    );
  };

  return renderView();
};

export default AuthPage;