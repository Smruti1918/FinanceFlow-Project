
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Zap, 
  LayoutDashboard, 
  Smartphone, 
  ChevronRight, 
  BarChart3,
  Target,
  Lock,
  CheckCircle2,
  Globe,
  Award,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { PlanTier } from '../types';

interface LandingProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onSelectPlan: (plan: PlanTier) => void;
}

const LandingPage: React.FC<LandingProps> = ({ onSignUp, onSignIn, onSelectPlan }) => {
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg">F</div>
          <span className="text-2xl font-extrabold text-white tracking-tight">FinanceFlow</span>
        </div>
        <div className="hidden md:flex items-center space-x-10">
          <button onClick={() => scrollToSection('features')} className="text-slate-400 font-bold hover:text-indigo-400 transition-all hover:scale-105 active:scale-95">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="text-slate-400 font-bold hover:text-indigo-400 transition-all hover:scale-105 active:scale-95">Pricing</button>
          <button onClick={() => scrollToSection('security')} className="text-slate-400 font-bold hover:text-indigo-400 transition-all hover:scale-105 active:scale-95">Security</button>
          <div className="flex items-center space-x-4 ml-4">
            <button onClick={onSignIn} className="text-white font-bold hover:text-indigo-400 px-4 transition-colors">Sign In</button>
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">Join Free</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-40 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-indigo-500/20">
            <Zap size={18} />
            <span>Smart wealth tracking for the modern era</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
            Control your <span className="text-indigo-500">Future</span>.
          </h1>
          <p className="text-2xl text-slate-400 mb-12 leading-relaxed max-w-lg font-medium">
            Everything you need to visualize, manage, and grow your net worth in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-xl hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 group active:scale-95 shadow-lg">
              <span>Get Started</span>
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <InteractiveDashboard />
      </header>

      {/* Features Section */}
      <section id="features" className="bg-slate-900/50 py-32 border-y border-white/5 relative">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
             <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Master your money.</h2>
             <p className="text-xl text-slate-400 font-medium leading-relaxed">Powerful tools designed for transparency and growth. Reach your financial milestones faster than ever before.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureItem icon={LayoutDashboard} title="Intuitive View" description="Visualize your income and expenses with clarity. Every detail, perfectly organized for your needs." />
            <FeatureItem icon={BarChart3} title="Wealth Analytics" description="Deep dive into your spending trends and net worth growth with interactive, high-fidelity charts." />
            <FeatureItem icon={Target} title="Goal Tracking" description="Set milestones and see your progress in real-time. Automated logic helps you save effectively." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Simple Pricing.</h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">Choose the plan that fits your financial journey. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <PricingCard 
              name="Starter" 
              price="0" 
              description="Basic tracking for personal use."
              features={["Unlimited Transactions", "Basic Dashboard", "Savings Goals (up to 3)", "Email Support", "Manual Sync"]}
              buttonText="Start for Free"
              onAction={() => onSelectPlan('Starter')}
            />
            <PricingCard 
              name="Professional" 
              price="999" 
              isPopular={true}
              description="Advanced tools for serious wealth growth."
              features={["Everything in Starter", "Advanced AI Analytics", "Unlimited Goals", "Auto-Bank Sync (Beta)", "Real-time Portfolio Insights", "Priority Support"]}
              buttonText="Go Professional"
              onAction={() => onSelectPlan('Professional')}
            />
            <PricingCard 
              name="Enterprise" 
              price="4999" 
              description="Bespoke financial control for families."
              features={["Everything in Pro", "Multi-user Shared Access", "Dedicated Wealth Advisor", "Custom API Integration", "White-glove Tax Support", "24/7 Concierge Support"]}
              buttonText="Select Enterprise"
              onAction={() => onSelectPlan('Enterprise')}
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-indigo-500/30">
                <Lock size={18} />
                <span>Security First Architecture</span>
              </div>
              <h2 className="text-5xl font-black mb-8 tracking-tight">Your data is safe <br /><span className="text-indigo-400">and encrypted.</span></h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium">We use the same encryption standards as major financial institutions to ensure your wealth data never falls into the wrong hands.</p>
              <div className="space-y-6">
                <SecurityPoint title="AES-256 Encryption" description="Your sensitive data is encrypted at rest and in transit using bank-grade technology." />
                <SecurityPoint title="Multi-Factor Auth" description="Mandatory 2FA support protects your account from unauthorized login attempts." />
              </div>
            </div>
            <div className="relative group">
              <div className="relative bg-slate-800 p-12 rounded-[3rem] border border-white/10 shadow-lg flex flex-col items-center text-center backdrop-blur-xl">
                <Award size={80} className="text-indigo-500 mb-8" />
                <h3 className="text-3xl font-bold mb-4">SOC-2 Type II Certified</h3>
                <p className="text-slate-400 text-lg">We undergo rigorous third-party audits to maintain the highest levels of operational security and reliability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16 pb-32">
          <div className="col-span-2 md:col-span-1">
             <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
              <span className="text-2xl font-bold text-white tracking-tight">FinanceFlow</span>
            </div>
            <p className="text-base leading-relaxed">Building the infrastructure for the next generation of wealth management.</p>
          </div>
          <div>
            <h4 className="text-white font-black text-xs mb-8 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-400">Wealth Tracking</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-400">Professional Tools</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs mb-8 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>© 2024 FinanceFlow Inc. Designed for elite finance.</p>
        </div>
      </footer>
    </div>
  );
};

const InteractiveDashboard = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [wealth, setWealth] = useState(12480500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWealth(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -12;
    const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={() => setTilt({ x: 0, y: 0 })} 
      className="relative cursor-none group" 
      style={{ perspective: '2000px' }}
    >
      {/* Background Orbs */}
      <div className="absolute -inset-20 bg-indigo-500/10 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-[100px] opacity-20"></div>
      
      {/* 3D Dashboard Container */}
      <div 
        className="relative transition-transform duration-300 ease-out" 
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Main Base Plate */}
        <div className="bg-slate-900 border border-white/10 rounded-[3.5rem] p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="bg-slate-950 rounded-[3rem] overflow-hidden aspect-video flex flex-col p-8 border border-white/5 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="h-4 w-40 bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-6 gap-6">
              <div className="col-span-4 bg-slate-900/40 rounded-[2rem] border border-white/5 p-6 relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portfolio Value</p>
                      <p className="text-3xl font-black text-white tracking-tighter">₹{(wealth / 100).toLocaleString()}</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black">+2.4%</div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1.5 px-6">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 30, 60, 85, 45].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/40 to-indigo-400/10 rounded-t-lg transition-all duration-700" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-900/40 rounded-2xl border border-white/5 p-4 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 animate-pulse"></div>
                    <div className="h-2 w-16 bg-slate-800 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Layer: Top Left (Yield) */}
        <div 
          className="absolute -top-10 -left-10 bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl transition-transform duration-500"
          style={{ transform: 'translateZ(80px)' }}
        >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Activity size={20} />
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Real-time Yield</p>
                <p className="text-lg font-black text-white">12.4%</p>
             </div>
          </div>
        </div>

        {/* Floating Layer: Bottom Right (Status) */}
        <div 
          className="absolute -bottom-10 -right-10 bg-emerald-500/10 backdrop-blur-xl px-6 py-4 rounded-3xl border border-emerald-500/20 shadow-2xl flex items-center gap-4 transition-transform duration-500"
          style={{ transform: 'translateZ(120px)' }}
        >
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">System Optimal</p>
        </div>

        {/* Interactive Pointing Cursor Effect (Visible when group hovered) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, description }: any) => (
  <div className="p-12 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 group">
    <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.25rem] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform"><Icon size={32} /></div>
    <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-lg font-medium">{description}</p>
  </div>
);

const PricingCard = ({ name, price, description, features, isPopular, buttonText, onAction }: any) => (
  <div className={`relative p-10 rounded-[2.5rem] flex flex-col transition-all duration-500 ${isPopular ? 'bg-indigo-600 text-white shadow-xl scale-105 z-10' : 'bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 shadow-sm backdrop-blur-md'}`}>
    {isPopular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-200 text-indigo-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>}
    <div className="mb-8">
      <h3 className="text-2xl font-black mb-2">{name}</h3>
      <p className={`text-sm ${isPopular ? 'text-indigo-100' : 'text-slate-500'}`}>{description}</p>
    </div>
    <div className="mb-10 flex items-baseline">
      <span className="text-4xl font-black tracking-tighter">₹{price}</span>
      <span className={`ml-1 text-sm ${isPopular ? 'text-indigo-200' : 'text-slate-500'}`}>/month</span>
    </div>
    <ul className="flex-1 space-y-4 mb-10">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center space-x-3">
          <CheckCircle2 size={18} className={isPopular ? 'text-indigo-300' : 'text-indigo-500'} />
          <span className={`text-sm font-bold ${isPopular ? 'text-indigo-50' : 'text-slate-400'}`}>{f}</span>
        </li>
      ))}
    </ul>
    <button onClick={onAction} className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 ${isPopular ? 'bg-white text-indigo-600 hover:bg-slate-100' : 'bg-white text-slate-900 hover:bg-slate-100 shadow-sm'}`}>{buttonText}</button>
  </div>
);

const SecurityPoint = ({ title, description }: any) => (
  <div className="flex space-x-6 group">
    <div className="flex-shrink-0 w-12 h-12 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 transition-all shadow-md"><CheckCircle2 size={24} /></div>
    <div><h4 className="text-xl font-bold mb-1 text-white">{title}</h4><p className="text-slate-400 font-medium">{description}</p></div>
  </div>
);

export default LandingPage;
