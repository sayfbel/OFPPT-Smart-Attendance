import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
    User, 
    Mail, 
    Shield, 
    Save, 
    Key, 
    Lock, 
    Camera, 
    CheckCircle2, 
    Info
} from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import './Profile.css';

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
            await authService.updateAdminProfile(profile.name, profile.email);
            addNotification(t('profile.success_msg'), "success");
            
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
            await authService.updateAdminPassword(passwords.currentPassword, passwords.newPassword);
            addNotification("Mot de passe mis à jour avec succès", "success");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || "Mot de passe actuel incorrect", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`profile-container ${isRtl ? 'rtl' : ''}`}>
            <div className={`profile-header ${isRtl ? 'rtl' : 'ltr'}`}>
                <h1 className="profile-title">
                    {t('profile.title', 'Mon Profil')}
                </h1>
                <p className="profile-subtitle">
                    {t('profile.subtitle', 'Gérez vos informations personnelles et vos paramètres de sécurité')}
                </p>
            </div>

            <div className={`profile-layout ${isRtl ? 'rtl' : ''}`}>
                <div className="profile-sidebar">
                    <div className="profile-user-card">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {profile.image ? (
                                    <img src={profile.image} alt={profile.name} className="profile-avatar-img" />
                                ) : (
                                    <div className="profile-avatar-placeholder">
                                        <User className="profile-avatar-icon" />
                                    </div>
                                )}
                            </div>
                            <button className="profile-camera-btn">
                                <Camera className="profile-camera-icon" />
                            </button>
                        </div>
                        <h2 className="profile-user-name">{profile.name || 'Utilisateur'}</h2>
                        <p className="profile-user-email">{profile.email}</p>
                        <span className="profile-role-badge">
                            <Shield className="profile-role-icon" />
                            {user?.role === 'admin' ? t('modals.roles.admin', 'Administrateur') : t('modals.roles.formateur', 'Formateur')}
                        </span>
                    </div>

                    <div className="profile-nav">
                        <button 
                            onClick={() => setActiveTab('general')}
                            className={`profile-tab-btn ${isRtl ? 'rtl' : ''} ${activeTab === 'general' ? 'active' : 'inactive'}`}
                        >
                            <User className="profile-tab-icon" />
                            {t('profile.personal_info', 'Informations Personnelles')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`profile-tab-btn border-t ${isRtl ? 'rtl' : ''} ${activeTab === 'security' ? 'active' : 'inactive'}`}
                        >
                            <Lock className="profile-tab-icon" />
                            {t('profile.password_section', 'Sécurité & Mot de passe')}
                        </button>
                    </div>
                </div>

                <div className="profile-main-content">
                    <div className="profile-card">
                        {activeTab === 'general' ? (
                            <div className="profile-fade-in">
                                <h3 className={`profile-section-title ${isRtl ? 'rtl' : ''}`}>
                                    {t('profile.personal_info', 'Informations Personnelles')}
                               </h3>
                                <form onSubmit={handleUpdateProfile} className="profile-form">
                                    <div className="profile-form-grid">
                                        <div className="profile-input-group">
                                            <label className={`profile-label ${isRtl ? 'rtl' : ''}`}>
                                                {t('profile.full_name', 'Nom Complet')}
                                            </label>
                                            <div className="profile-input-wrapper">
                                                <div className={`profile-input-icon-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
                                                    <User className="profile-input-icon" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className={`profile-input ${isRtl ? 'rtl' : 'ltr'}`}
                                                    placeholder={t('profile.full_name', 'Nom Complet')}
                                                />
                                            </div>
                                        </div>
                                        <div className="profile-input-group">
                                            <label className={`profile-label ${isRtl ? 'rtl' : ''}`}>
                                                {t('profile.email', 'Adresse Email')}
                                            </label>
                                            <div className="profile-input-wrapper">
                                                <div className={`profile-input-icon-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
                                                    <Mail className="profile-input-icon" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                                    className={`profile-input ${isRtl ? 'rtl' : 'ltr'}`}
                                                    placeholder={t('profile.email', 'Adresse Email')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`profile-form-footer ${isRtl ? 'rtl' : 'ltr'}`}>
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="profile-btn-submit"
                                        >
                                            {loading ? <div className="profile-spinner"></div> : <><Save className="w-4 h-4" /> {t('profile.update_button', 'Enregistrer les modifications')}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="profile-fade-in">
                                <h3 className={`profile-section-title ${isRtl ? 'rtl' : ''}`}>
                                    {t('profile.password_section', 'Sécurité & Mot de passe')}
                                </h3>
                                <form onSubmit={handleUpdatePassword} className="profile-form">
                                    <div className="profile-input-group">
                                        <label className={`profile-label ${isRtl ? 'rtl' : ''}`}>
                                            {t('profile.current_password', 'Mon mot de passe actuel')}
                                        </label>
                                        <div className="profile-input-wrapper">
                                            <div className={`profile-input-icon-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
                                                <Key className="profile-input-icon" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={passwords.currentPassword}
                                                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                className={`profile-input ${isRtl ? 'rtl' : 'ltr'}`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-form-grid">
                                        <div className="profile-input-group">
                                            <label className={`profile-label ${isRtl ? 'rtl' : ''}`}>
                                                {t('profile.new_password', 'Nouveau mot de passe')}
                                            </label>
                                            <div className="profile-input-wrapper">
                                                <div className={`profile-input-icon-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
                                                    <Lock className="profile-input-icon" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwords.newPassword}
                                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    className={`profile-input ${isRtl ? 'rtl' : 'ltr'}`}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="profile-input-group">
                                            <label className={`profile-label ${isRtl ? 'rtl' : ''}`}>
                                                {t('profile.confirm_password', 'Confirmer le mot de passe')}
                                            </label>
                                            <div className="profile-input-wrapper">
                                                <div className={`profile-input-icon-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>
                                                    <CheckCircle2 className="profile-input-icon" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwords.confirmPassword}
                                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                    className={`profile-input ${isRtl ? 'rtl' : 'ltr'}`}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-form-footer profile-form-footer-flex">
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="profile-btn-submit profile-btn-submit-secondary full-width"
                                        >
                                            {loading ? <div className="profile-spinner"></div> : <><Lock className="w-4 h-4" /> {t('profile.change_password', 'Mettre à jour')}</>}
                                        </button>
                                        <p className="profile-hint">
                                            <Info className="profile-hint-icon" />
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
