
import React, { useState, useRef } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Save, 
  CheckCircle, 
  Camera, 
  Smartphone, 
  Globe, 
  Lock, 
  History, 
  LogOut, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff,
  ChevronRight,
  Database,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, UserPreferences } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'data'>('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
  });

  const [prefs, setPrefs] = useState<UserPreferences>(user.preferences || {
    currency: 'INR',
    privacyMode: false,
    twoFactorEnabled: true,
    language: 'English (US)',
    timezone: 'UTC+5:30'
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...formData, preferences: prefs });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const togglePref = (key: keyof UserPreferences) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    onUpdateUser({ preferences: newPrefs });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64 }));
        onUpdateUser({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Configure your professional wealth management environment.</p>
        </div>
        {showSuccess && (
          <div className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold animate-in slide-in-from-top-2 shadow-lg shadow-indigo-100">
            <CheckCircle size={14} />
            <span>Updates saved successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <nav className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-2 shadow-sm">
            <TabLink icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabLink icon={Globe} label="Preferences" active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')} />
            <TabLink icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <TabLink icon={Database} label="Data & Storage" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
          </nav>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/20">
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Account Status</p>
            <div className="flex items-center space-x-3 text-emerald-600 mb-2">
              <CheckCircle size={14} />
              <span className="text-xs font-bold">Verified Account</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Synced with Cloud Firestore. All your changes are persistent.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
            
            {activeTab === 'profile' && (
              <div className="p-8 md:p-12 space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                      {formData.avatar ? (
                        <img src={formData.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={64} /></div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform shadow-lg"
                    >
                      <Camera size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{formData.fullName}</h3>
                    <p className="text-slate-500 font-medium text-sm">{formData.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-[10px] font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">{user.planTier} Member</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Name" value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} />
                    <Field label="Email Address" value={formData.email} readOnly />
                    <Field label="Phone Number" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                      <textarea 
                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] transition-all resize-none"
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all flex items-center space-x-2 shadow-lg shadow-indigo-100 dark:shadow-none">
                      <Save size={18} />
                      <span>Update Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-8 md:p-12 space-y-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">App Preferences</h3>
                  <p className="text-sm text-slate-500 font-medium">Customize how FinanceFlow looks and behaves for you.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Base Currency</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Primary currency for analytics and totals.</p>
                    </div>
                    <select 
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold outline-none dark:text-white"
                      value={prefs.currency}
                      onChange={e => {
                        const newPrefs = { ...prefs, currency: e.target.value as any };
                        setPrefs(newPrefs);
                        onUpdateUser({ preferences: newPrefs });
                      }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <ToggleItem 
                    title="Privacy Mode" 
                    desc="Blurs balances until hovered to protect your financial data." 
                    checked={prefs.privacyMode} 
                    onToggle={() => togglePref('privacyMode')} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8 md:p-12 space-y-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Security & Privacy</h3>
                  <p className="text-sm text-slate-500 font-medium">Manage your credentials and audit your account activity.</p>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{prefs.twoFactorEnabled ? 'Highly Protected' : 'At Risk'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => togglePref('twoFactorEnabled')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${prefs.twoFactorEnabled ? 'bg-slate-200 text-slate-800' : 'bg-indigo-600 text-white'}`}
                    >
                      {prefs.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                      <History size={14} className="text-indigo-600" />
                      <span>Active Sessions</span>
                    </h4>
                    <div className="space-y-3">
                      <SessionItem device="Current Device Session" location="Cloud Native" time="Now" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="p-8 md:p-12 space-y-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Data & Storage</h3>
                  <p className="text-sm text-slate-500 font-medium">Manage your stored financial records and account lifecycle.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataAction 
                    icon={Download} 
                    title="Export Wealth Data" 
                    desc="Download all transactions and goals in CSV format." 
                    actionLabel="Generate Report" 
                  />
                  <DataAction 
                    icon={Trash2} 
                    title="Delete Account" 
                    desc="Permanently remove all data from our servers. This cannot be undone." 
                    actionLabel="Initiate Deletion"
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Erase all data?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">This action is permanent. Your profile, transactions, and wealth goals will be destroyed.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onDeleteAccount}
                  className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-100"
                >
                  Yes, Delete Permanently
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabLink = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
        : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const Field = ({ label, value, onChange, readOnly = false }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="text"
      readOnly={readOnly}
      className={`w-full px-5 py-3.5 border rounded-2xl text-sm outline-none transition-all ${
        readOnly 
          ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed' 
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500'
      }`}
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  </div>
);

const ToggleItem = ({ title, desc, checked, onToggle }: any) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6.5 rounded-full transition-all relative ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-6.5' : 'left-1'}`} />
    </button>
  </div>
);

const SessionItem = ({ device, location, time }: any) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
    <div>
      <h5 className="text-sm font-bold text-slate-900 dark:text-white">{device}</h5>
      <p className="text-[10px] text-slate-500 font-medium">{location} • {time}</p>
    </div>
    <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Active</button>
  </div>
);

const DataAction = ({ icon: Icon, title, desc, actionLabel, variant = 'default', onClick }: any) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'}`}>
      <Icon size={24} />
    </div>
    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed px-4">{desc}</p>
    <button 
      onClick={onClick}
      className={`w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${variant === 'danger' ? 'border border-rose-200 text-rose-500 hover:bg-rose-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
    >
      {actionLabel}
    </button>
  </div>
);

export default SettingsPage;
