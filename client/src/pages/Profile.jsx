import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
    User, 
    Mail, 
    Shield, 
    Save, 
    Key, 
    Lock, 
    Camera, 
    CheckCircle2, 
    AlertCircle,
    Info,
    LayoutDashboard
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';
    const { user, setUser } = useAuth();
    const { addNotification } = useNotification();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        image: ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                image: user.image || ''
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Centralized profile update for name and email
            await axios.put('/api/auth/update-profile', {
                name: profile.name,
                email: profile.email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification(t('profile.success_msg'), "success");
            
            // Update local user state
            setUser(prev => ({ ...prev, name: profile.name, email: profile.email }));
        } catch (err) {
            addNotification(err.response?.data?.message || t('profile.error_msg'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return addNotification(t('profile.password_match_error'), "error");
        }
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Use the new centralized auth endpoint
            await axios.put('/api/auth/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addNotification("Mot de passe mis à jour avec succès", "success");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || "Mot de passe actuel incorrect", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`space-y-12 fade-up max-w-[1200px] mx-auto pb-20 ${isRtl ? 'text-right' : ''}`}>
            {/* Header section */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="space-y-2">
                    <h1 className={`text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none ${isRtl ? 'text-right' : ''}`}>
                        {t('profile.title')}
                    </h1>
                    <p className={`text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase ${isRtl ? 'text-right' : ''}`}>
                        {t('profile.subtitle')}
                    </p>
                </div>
            </div>

            <div className={`flex flex-col lg:flex-row gap-12 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                {/* Sidebar / Left Column */}
                <div className="w-full lg:w-[380px] space-y-10">
                    <div className="bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/5 rounded-[48px] p-12 shadow-sm relative overflow-hidden group">
                        {/* Avatar backdrop */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[var(--secondary)] to-[#003d6b] -z-0"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-[32px] bg-white dark:bg-slate-800 p-2 shadow-2xl relative mb-8 group-hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-[24px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-50 dark:border-white/5 relative group/pic">
                                    {profile.image ? (
                                        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-slate-300 dark:text-slate-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/pic:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black italic text-[var(--secondary)] dark:text-white uppercase tracking-tight text-center leading-tight mb-2">
                                {profile.name}
                            </h3>
                            <div className="px-5 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[9px] font-black uppercase tracking-widest mb-8">
                                {user?.role === 'admin' ? t('modals.roles.admin') : t('modals.roles.formateur')}
                            </div>

                            <div className="w-full space-y-4 pt-8 border-t border-slate-50 dark:border-white/5">
                                <button 
                                    onClick={() => setActiveTab('general')}
                                    className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${isRtl ? 'flex-row-reverse' : ''} ${activeTab === 'general' ? 'bg-[var(--secondary)] text-white shadow-xl shadow-[var(--secondary)]/20' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.personal_info')}</span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${isRtl ? 'flex-row-reverse' : ''} ${activeTab === 'security' ? 'bg-[var(--secondary)] text-white shadow-xl shadow-[var(--secondary)]/20' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                                >
                                    <Lock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.password_section')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Système de Sécurité</h4>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase italic">
                            "Votre identité numérique est protégée par un protocole de cryptage asymétrique de grade professionnel."
                        </p>
                        <Shield className="w-8 h-8 text-[var(--primary)] opacity-50" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'general' ? (
                        <div className="bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/5 rounded-[48px] p-12 md:p-16 shadow-sm fade-up">
                            <div className="mb-12">
                                <h3 className={`text-3xl font-black italic tracking-tighter text-[var(--secondary)] dark:text-white uppercase leading-none mb-3 ${isRtl ? 'text-right' : ''}`}>{t('profile.personal_info')}</h3>
                                <p className={`text-[9px] font-bold text-slate-400 tracking-widest uppercase italic ${isRtl ? 'text-right' : ''}`}>{t('profile.subtitle')}</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <User className="w-3 h-3 text-[var(--primary)]" /> {t('profile.full_name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                                            className={`w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] dark:text-white focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 ${isRtl ? 'text-right' : ''}`}
                                            placeholder={t('profile.full_name')}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Mail className="w-3 h-3 text-[var(--primary)]" /> {t('profile.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                            className={`w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] dark:text-white focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 ${isRtl ? 'text-right' : ''}`}
                                            placeholder={t('profile.email')}
                                        />
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-slate-50 dark:border-white/5">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="btn-ista px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {loading ? t('common.loading') : <><Save className="w-4 h-4" /> {t('profile.update_button')}</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[var(--surface)] border border-slate-100 dark:border-white/5 rounded-[48px] p-12 md:p-16 shadow-sm fade-up">
                            <div className="mb-12">
                                <h3 className={`text-3xl font-black italic tracking-tighter text-[var(--secondary)] dark:text-white uppercase leading-none mb-3 ${isRtl ? 'text-right' : ''}`}>{t('profile.password_section')}</h3>
                                <p className={`text-[9px] font-bold text-slate-400 tracking-widest uppercase italic ${isRtl ? 'text-right' : ''}`}>{t('profile.password_subtitle')}</p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="space-y-10">
                                <div className="space-y-4">
                                    <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Key className="w-3 h-3 text-red-500" /> {t('profile.current_password')}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.currentPassword}
                                        onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className={`w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] dark:text-white focus:border-red-500 focus:ring-8 focus:ring-red-500/5 outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Lock className="w-3 h-3 text-[var(--primary)]" /> {t('profile.new_password')}
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className={`w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] dark:text-white focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <Lock className="w-3 h-3 text-[var(--primary)]" /> {t('profile.confirm_password')}
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className={`w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] dark:text-white focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all ${isRtl ? 'text-right' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className={`pt-10 border-t border-slate-50 dark:border-white/5 flex flex-col md:flex-row gap-6 items-center ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto px-12 py-5 bg-[var(--secondary)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--secondary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {loading ? t('profile.sync') : t('profile.change_password')}
                                    </button>
                                    <p className={`text-[10px] font-black uppercase italic text-slate-300 gap-2 flex items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Info className="w-4 h-4" /> {t('profile.password_hint')}
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
