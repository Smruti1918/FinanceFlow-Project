
import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, Book, Shield, ExternalLink, X, ChevronRight, Send, CheckCircle, Mail, HelpCircle, LifeBuoy } from 'lucide-react';

const ARTICLES: Record<string, { title: string, content: string, category: string }> = {
  'Linking your bank': {
    category: 'Getting Started',
    title: 'How to Link your Bank Account',
    content: 'To link your bank account, go to Settings > Accounts and click on "Add Institution". We use secure providers to sync your data instantly.'
  },
  'Dashboard overview': {
    category: 'Getting Started',
    title: 'Understanding your Dashboard',
    content: 'The dashboard gives you a real-time summary of your net worth, monthly income, and expenses.'
  },
  'Goal setup': {
    category: 'Getting Started',
    title: 'Setting up Savings Goals',
    content: 'Navigate to "Goals & Savings" and click "New Goal". Enter your target amount and name.'
  },
  'Two-factor auth': {
    category: 'Account Security',
    title: 'Securing your Account with 2FA',
    content: 'We highly recommend enabling 2FA. Go to Settings > Security and toggle on "Two-Factor Authentication".'
  },
  'Data privacy': {
    category: 'Account Security',
    title: 'Your Privacy Matters',
    content: 'We use 256-bit AES encryption. Your financial data is yours and yours alone.'
  }
};

const HelpPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [subject, setSubject] = useState('Technical Support');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setMessage('');
    }, 1500);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setIsSent(false);
  };

  const filteredCategories = useMemo(() => {
    const categories = [
      { id: 'cat1', icon: Book, title: "Getting Started", description: "Learn the basics of wealth tracking.", links: ['Linking your bank', 'Dashboard overview', 'Goal setup'] },
      { id: 'cat2', icon: Shield, title: "Account Security", description: "Keep your data safe with best practices.", links: ['Two-factor auth', 'Data privacy'] },
      { id: 'cat3', icon: MessageCircle, title: "Support", description: "Connect with our expert team.", links: [] }
    ];

    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      links: cat.links.filter(l => l.toLowerCase().includes(term) || (ARTICLES[l]?.content || '').toLowerCase().includes(term))
    })).filter(cat => cat.title.toLowerCase().includes(term) || cat.links.length > 0);
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto py-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">How can we help?</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Search our library of guides and support articles.</p>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics (e.g., 'security')..."
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredCategories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <cat.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{cat.title}</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm mb-6 leading-relaxed">{cat.description}</p>
            <ul className="space-y-3">
              {cat.links.map(l => (
                <li key={l}>
                  <button onClick={() => setSelectedArticle(l)} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between w-full group transition-colors">
                    <span>{l}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Escalation Banner */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-100 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Still need help?</h2>
          <p className="text-indigo-100 font-medium max-w-md">Our global support team is available 24/7 for technical and financial inquiries.</p>
        </div>
        <button 
          onClick={() => setIsContactModalOpen(true)}
          className="relative z-10 mt-8 md:mt-0 bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95"
        >
          Contact Us
        </button>
      </div>

      {/* Help Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full tracking-widest">Help Article</span>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">{ARTICLES[selectedArticle]?.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium">{ARTICLES[selectedArticle]?.content}</p>
              <button onClick={() => setSelectedArticle(null)} className="mt-10 w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">Close Guide</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <LifeBuoy className="animate-pulse" />
                <h3 className="text-xl font-black tracking-tight">Support Desk</h3>
              </div>
              <button onClick={closeContactModal} className="hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>

            <div className="p-8">
              {isSent ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 scale-in-center">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">An expert advisor will review your request and reach out within 2 hours.</p>
                  <button onClick={closeContactModal} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    Return to Help Center
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                      <select 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold dark:text-white"
                      >
                        <option>Technical Support</option>
                        <option>Financial Inquiry</option>
                        <option>Security Report</option>
                        <option>Account Billing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                      <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we assist you today?"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white min-h-[160px] resize-none"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={isSending}
                    className={`w-full py-5 rounded-2xl font-black text-white flex items-center justify-center space-x-3 transition-all active:scale-95 ${isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none'}`}
                  >
                    {isSending ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Submit Ticket</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Typical response time: <span className="text-indigo-600">2 Hours</span></p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
