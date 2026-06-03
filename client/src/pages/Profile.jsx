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
    LayoutDashboard,
    Activity,
    Fingerprint
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
        <div className={`max-w-6xl mx-auto space-y-6 ${isRtl ? 'text-right' : ''}`}>
            {/* Page Header */}
            <div className={`mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {t('profile.title', 'Mon Profil')}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    {t('profile.subtitle', 'Gérez vos informations personnelles et vos paramètres de sécurité')}
                </p>
            </div>

            <div className={`flex flex-col lg:flex-row gap-8 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
                {/* Left Sidebar */}
                <div className="w-full lg:w-1/3 space-y-6">
                    {/* User Info Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                                {profile.image ? (
                                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-[var(--primary)] text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{profile.name || 'Utilisateur'}</h2>
                        <p className="text-sm text-slate-500 mb-4">{profile.email}</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                            <Shield className="w-3.5 h-3.5" />
                            {user?.role === 'admin' ? t('modals.roles.admin', 'Administrateur') : t('modals.roles.formateur', 'Formateur')}
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${isRtl ? 'flex-row-reverse' : ''} ${activeTab === 'general' ? 'bg-slate-50 text-[var(--primary)] border-l-4 border-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
                            style={{ borderLeftColor: activeTab === 'general' && !isRtl ? 'var(--primary)' : 'transparent', borderRightColor: activeTab === 'general' && isRtl ? 'var(--primary)' : 'transparent', borderRightWidth: isRtl ? '4px' : '0' }}
                        >
                            <User className="w-5 h-5" />
                            {t('profile.personal_info', 'Informations Personnelles')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-t border-slate-100 ${isRtl ? 'flex-row-reverse' : ''} ${activeTab === 'security' ? 'bg-slate-50 text-[var(--primary)] border-l-4 border-[var(--primary)]' : 'text-slate-600 hover:bg-slate-50'}`}
                            style={{ borderLeftColor: activeTab === 'security' && !isRtl ? 'var(--primary)' : 'transparent', borderRightColor: activeTab === 'security' && isRtl ? 'var(--primary)' : 'transparent', borderRightWidth: isRtl ? '4px' : '0' }}
                        >
                            <Lock className="w-5 h-5" />
                            {t('profile.password_section', 'Sécurité & Mot de passe')}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
                        {activeTab === 'general' ? (
                            <div className="animate-in fade-in">
                                <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-6 ${isRtl ? 'text-right' : ''}`}>
                                    {t('profile.personal_info', 'Informations Personnelles')}
                                </h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : ''}`}>
                                                {t('profile.full_name', 'Nom Complet')}
                                            </label>
                                            <div className="relative">
                                                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                                    <User className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className={`block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-50 transition-colors ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                                                    placeholder={t('profile.full_name', 'Nom Complet')}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : ''}`}>
                                                {t('profile.email', 'Adresse Email')}
                                            </label>
                                            <div className="relative">
                                                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                                    <Mail className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                    className={`block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-50 transition-colors ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                                                    placeholder={t('profile.email', 'Adresse Email')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`pt-6 border-t border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-50`}
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-4 h-4" /> {t('profile.update_button', 'Enregistrer les modifications')}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="animate-in fade-in">
                                <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-6 ${isRtl ? 'text-right' : ''}`}>
                                    {t('profile.password_section', 'Sécurité & Mot de passe')}
                                </h3>
                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : ''}`}>
                                            {t('profile.current_password', 'Mot de passe actuel')}
                                        </label>
                                        <div className="relative">
                                            <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                                <Key className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={passwords.currentPassword}
                                                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                className={`block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-50 transition-colors ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : ''}`}>
                                                {t('profile.new_password', 'Nouveau mot de passe')}
                                            </label>
                                            <div className="relative">
                                                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                                    <Lock className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwords.newPassword}
                                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    className={`block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-50 transition-colors ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`block text-sm font-medium text-slate-700 dark:text-slate-300 ${isRtl ? 'text-right' : ''}`}>
                                                {t('profile.confirm_password', 'Confirmer le mot de passe')}
                                            </label>
                                            <div className="relative">
                                                <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                                    <CheckCircle2 className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwords.confirmPassword}
                                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                    className={`block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] focus:ring-opacity-50 transition-colors ${isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'}`}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50`}
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Lock className="w-4 h-4" /> {t('profile.change_password', 'Mettre à jour')}</>}
                                        </button>
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <Info className="w-4 h-4" />
                                            {t('profile.password_hint', 'Vous devrez vous reconnecter après cette modification.')}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
