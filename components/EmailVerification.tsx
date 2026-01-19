
import React from 'react';
import { Mail, ArrowRight, ShieldCheck, CheckCircle, ExternalLink } from 'lucide-react';

interface EmailVerificationPageProps {
  email: string;
  onGoToLogin: () => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ email, onGoToLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 text-center relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

        <div className="mb-10 inline-flex items-center justify-center w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl animate-bounce">
          <Mail size={40} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          Verify your Email
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
          We have sent a verification email to <br />
          <span className="text-slate-900 dark:text-white font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg mt-2 inline-block">
            {email}
          </span>
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-10 text-left border border-slate-100 dark:border-slate-800">
          <div className="flex items-start space-x-3 mb-4">
            <CheckCircle className="text-emerald-500 shrink-0" size={18} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Click the link in the email to activate your account.</p>
          </div>
          <div className="flex items-start space-x-3">
            <ShieldCheck className="text-indigo-500 shrink-0" size={18} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Verify your identity to access professional features.</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onGoToLogin}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center space-x-3 active:scale-95 group"
          >
            <span>Proceed to Login</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="text-xs font-black text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Didn't receive email? Resend</span>
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center space-x-6 text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Bank-Grade Privacy</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Instant Setup</span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
