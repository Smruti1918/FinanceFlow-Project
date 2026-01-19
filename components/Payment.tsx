
import React, { useState } from 'react';
import { CreditCard, ArrowLeft, ShieldCheck, Zap, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { PlanTier } from '../types';

interface PaymentPageProps {
  plan: PlanTier;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ plan, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onSuccess();
    }, 2500);
  };

  const planPrice = plan === 'Professional' ? '999' : '4,999';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 opacity-50"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      
      <button onClick={onCancel} className="absolute top-10 left-10 flex items-center space-x-2 text-slate-500 hover:text-white transition-colors font-bold">
        <ArrowLeft size={20} />
        <span>Cancel</span>
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Plan Summary */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-500/20">
              <Zap size={16} />
              <span>Checkout</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">Complete your <br /><span className="text-indigo-500">Subscription</span>.</h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">Unlock the full power of FinanceFlow and start growing your wealth with professional analytics.</p>
          </div>

          <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <ShieldCheck size={40} className="text-indigo-500/30" />
             </div>
             <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Selected Strategy</p>
             <h3 className="text-3xl font-black mb-1">{plan} Tier</h3>
             <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-indigo-500">₹{planPrice}</span>
                <span className="text-sm text-slate-500 ml-2">/month</span>
             </div>
             <div className="space-y-4 pt-6 border-t border-white/5">
                <CheckPoint text="256-bit Bank Grade Security" />
                <CheckPoint text="Instant Activation" />
                <CheckPoint text="Cancel Anytime" />
             </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-[3rem] p-10 text-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-10 duration-700">
           {isProcessing ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-2xl font-black tracking-tight mb-2">Verifying Payment</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Secure transaction in progress...</p>
                </div>
             </div>
           ) : (
             <form onSubmit={handlePay} className="space-y-8">
               <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black tracking-tight">Payment Details</h2>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-slate-100 rounded"></div>
                    <div className="w-8 h-5 bg-slate-100 rounded"></div>
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        required
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                        <input 
                          required
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={e => setExpiry(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV Code</label>
                        <input 
                          required
                          placeholder="•••"
                          type="password"
                          maxLength={3}
                          value={cvv}
                          onChange={e => setCvv(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                        />
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 active:scale-95 group">
                    <span>Pay ₹{planPrice}</span>
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center justify-center space-x-2 text-slate-400">
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Bank-Grade Encryption</span>
                  </div>
               </div>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

const CheckPoint = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 text-slate-300">
    <CheckCircle size={18} className="text-emerald-500" />
    <span className="text-sm font-bold">{text}</span>
  </div>
);

export default PaymentPage;
