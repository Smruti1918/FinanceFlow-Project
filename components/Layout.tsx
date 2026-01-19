
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  Bell,
  Search,
  User,
  X,
  Sun,
  Moon,
  ArrowRight,
  Cloud,
  CloudOff,
  LogOut as LogOutIcon,
  Info,
  CheckCircle,
  AlertTriangle,
  Inbox
} from 'lucide-react';
import { Page, UserProfile } from '../types';
import { isFirebaseConfigured } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning';
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Salary Credited', description: 'Your monthly salary from Global Tech Corp has been processed.', type: 'success', time: '2h ago', isRead: false },
  { id: '2', title: 'Goal Milestone', description: "You've reached 75% of your 'Capital Reserve' target.", type: 'info', time: '5h ago', isRead: false },
  { id: '3', title: 'Large Expense', description: 'A transaction of ₹1,59,900 at Apple Inc. was detected.', type: 'warning', time: '1d ago', isRead: false },
];

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePage, 
  onNavigate, 
  onLogout, 
  user, 
  theme, 
  onToggleTheme,
  searchValue,
  onSearchChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const mainLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'savings', label: 'Wealth Goals', icon: Target },
  ];

  const handleNavClick = (id: Page) => {
    onNavigate(id);
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    setShowSuggestions(false);
    onSearchChange('');
  };

  const handleRemoveNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSuggestionClick = (type: 'page' | 'transaction' | 'goal', value: string) => {
    if (type === 'page') {
      handleNavClick(value as Page);
    } else if (type === 'transaction') {
      onSearchChange(value);
      onNavigate('transactions');
      setShowSuggestions(false);
    } else if (type === 'goal') {
      onNavigate('savings');
      setShowSuggestions(false);
      onSearchChange('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = searchValue.trim().length > 0 ? {
    pages: [
      ...mainLinks,
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help Center', icon: HelpCircle }
    ].filter(p => p.label.toLowerCase().includes(searchValue.toLowerCase())),
    transactions: Array.from(new Set(user.transactions
      .filter(t => t.vendor.toLowerCase().includes(searchValue.toLowerCase()))
      .map(t => t.vendor))).slice(0, 3),
    goals: user.savings
      .filter(g => g.name.toLowerCase().includes(searchValue.toLowerCase()))
      .map(g => g.name).slice(0, 3)
  } : null;

  const hasSuggestions = suggestions && (
    suggestions.pages.length > 0 || 
    suggestions.transactions.length > 0 || 
    suggestions.goals.length > 0
  );

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-600 dark:text-slate-400 transition-colors duration-300 font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Glass Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 
        bg-white/85 dark:bg-slate-900/90 backdrop-blur-3xl 
        border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('dashboard')}>
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg">
                F
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">FinanceFlow</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Navigation</p>
            {mainLinks.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as Page)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                  activePage === item.id 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <item.icon size={18} className={activePage === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                  <span className={`text-sm tracking-tight ${activePage === item.id ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                </div>
                {activePage === item.id && <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
             <div className="bg-slate-100 dark:bg-slate-800/40 p-5 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {isFirebaseConfigured ? (
                    <Cloud size={14} className="text-emerald-500" />
                  ) : (
                    <CloudOff size={14} className="text-amber-500" />
                  )}
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    {isFirebaseConfigured ? 'Cloud Synced' : 'Demo Mode (Local)'}
                  </p>
                </div>
                {!isFirebaseConfigured && (
                  <p className="text-[9px] text-slate-500 mt-2 leading-tight">Add keys to firebase.ts to enable Cloud Sync.</p>
                )}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 lg:px-12 shrink-0 z-40">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize tracking-tighter">{activePage}</h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="relative" ref={searchContainerRef}>
              <div className="hidden md:flex items-center px-5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full group hover:border-indigo-400 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Search size={14} className="mr-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-500 w-48 transition-all focus:w-64"
                  value={searchValue}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => { onSearchChange(e.target.value); setShowSuggestions(true); }}
                />
              </div>

              {showSuggestions && searchValue.trim() && (
                <div className="absolute top-full mt-3 right-0 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {hasSuggestions ? (
                      <div className="space-y-4">
                        {suggestions.pages.map(page => (
                          <button key={page.id} onClick={() => handleSuggestionClick('page', page.id)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all group">
                            <div className="flex items-center space-x-3">
                              <page.icon size={14} className="text-slate-400 group-hover:text-indigo-500" />
                              <span>{page.label}</span>
                            </div>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                          <Search size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">No results for "{searchValue}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={onToggleTheme} className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="relative" ref={notificationsRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative ${isNotificationsOpen ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : ''}`}>
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-4 w-[420px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-[100]">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notifications</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">YOU HAVE {notifications.length} UPDATES</p>
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleClearAllNotifications}
                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline tracking-widest uppercase"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[480px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                              n.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                              n.type === 'warning' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' :
                              'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                            }`}>
                              {n.type === 'success' ? <CheckCircle size={18} /> : 
                               n.type === 'warning' ? <AlertTriangle size={18} /> : 
                               <Info size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{n.title}</h4>
                                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{n.description}</p>
                            </div>
                            <button 
                              onClick={(e) => handleRemoveNotification(e, n.id)}
                              className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 px-8 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700">
                          <Inbox size={40} />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">Quiet for now</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-12">We'll let you know when there's movement in your portfolio or account activity.</p>
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
                      <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">View All Activity</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center space-x-3 p-1 rounded-full transition-all ${isProfileOpen ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><User size={20} /></div>}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-3">
                    <DropdownItem icon={User} label="Profile Overview" onClick={() => handleNavClick('settings')} />
                    <DropdownItem icon={Settings} label="App Settings" onClick={() => handleNavClick('settings')} />
                    <DropdownItem icon={HelpCircle} label="Customer Support" onClick={() => handleNavClick('help')} />
                    <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
                    <DropdownItem icon={LogOut} label="Secure Sign Out" variant="danger" onClick={() => { setIsLogoutModalOpen(true); setIsProfileOpen(false); }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOutIcon size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Secure Sign Out?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Are you sure you want to end your active session and log out of FinanceFlow?</p>
              <div className="flex flex-col gap-3">
                <button onClick={onLogout} className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-100">Yes, Sign Out</button>
                <button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">Stay Logged In</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon: Icon, label, onClick, variant = 'default' }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${variant === 'danger' ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

export default Layout;
