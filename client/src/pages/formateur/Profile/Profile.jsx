import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import authService from '../../../services/authService';
import { 
    User, 
    Mail, 
    Shield, 
    Save, 
    Key, 
    Lock, 
    Camera, 
    Info
} from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import './Profile.css';

const Profile = () => {
    const { user, login } = useAuth();
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
            await authService.updateFormateurProfile(profile);
            addNotification("Profil mis à jour avec succès", "success");
            
            // Re-fetch me
            const meData = await authService.getMe();
            login(meData, localStorage.getItem('token'));
        } catch (err) {
            addNotification(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return addNotification("Les nouveaux mots de passe ne correspondent pas", "error");
        }
        
        setLoading(true);
        try {
            await authService.updateFormateurPassword(passwords.currentPassword, passwords.newPassword);
            addNotification("Mot de passe mis à jour avec succès", "success");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            addNotification(err.response?.data?.message || "Mot de passe actuel incorrect", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prof-container fade-up">
            {/* Header section */}
            <div className="prof-header">
                <div className="prof-title-wrapper">
                    <h1 className="prof-title">
                        PROFIL <span className="prof-title-highlight">UTILISATEUR</span>
                    </h1>
                    <p className="prof-subtitle">
                        GESTION DES INFORMATIONS PERSONNELLES ET SÉCURITÉ
                    </p>
                </div>
            </div>

            <div className="prof-content-wrapper">
                {/* Sidebar / Left Column */}
                <div className="prof-sidebar">
                    <div className="prof-sidebar-card group">
                        {/* Avatar backdrop */}
                        <div className="prof-avatar-backdrop"></div>
                        
                        <div className="prof-avatar-content">
                            <div className="prof-avatar-wrapper group">
                                <div className="prof-avatar-inner group/pic">
                                    {profile.image ? (
                                        <img src={profile.image} alt={profile.name} className="prof-avatar-img" />
                                    ) : (
                                        <User className="prof-avatar-icon" />
                                    )}
                                    <div className="prof-avatar-overlay">
                                        <Camera className="prof-avatar-cam-icon" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="prof-user-name">
                                {profile.name}
                            </h3>
                            <div className="prof-user-role">
                                {user?.role === 'admin' ? 'ADMINISTRATEUR' : 'FORMATEUR'}
                            </div>

                            <div className="prof-tabs-wrapper">
                                <button 
                                    onClick={() => setActiveTab('general')}
                                    className={`prof-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                                >
                                    <User className="prof-tab-icon" />
                                    <span className="prof-tab-text">Informations Générales</span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('security')}
                                    className={`prof-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                                >
                                    <Lock className="prof-tab-icon" />
                                    <span className="prof-tab-text">Sécurité du Compte</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="prof-security-card">
                        <div className="prof-security-glow"></div>
                        <h4 className="prof-security-title">Système de Sécurité</h4>
                        <p className="prof-security-desc">
                            "Votre identité numérique est protégée par un protocole de cryptage asymétrique de grade professionnel."
                        </p>
                        <Shield className="prof-security-icon" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="prof-main">
                    {activeTab === 'general' ? (
                        <div className="prof-form-card fade-up">
                            <div className="prof-form-header">
                                <h3 className="prof-form-title">INFORMATIONS <span className="prof-form-title-highlight">GÉNÉRALES</span></h3>
                                <p className="prof-form-subtitle">METTEZ À JOUR VOS COORDONNÉES PERSONNELLES</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="prof-form">
                                <div className="prof-form-grid">
                                    <div className="prof-input-group">
                                        <label className="prof-input-label">
                                            <User className="prof-label-icon" /> NOM COMPLET
                                        </label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile({ ...profile, name: e.target.value })}
                                            className="prof-input"
                                            placeholder="Saad Bentalb"
                                        />
                                    </div>
                                    <div className="prof-input-group">
                                        <label className="prof-input-label">
                                            <Mail className="prof-label-icon" /> ADRESSE EMAIL
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                            className="prof-input"
                                            placeholder="saad@ofppt.ma"
                                        />
                                    </div>
                                </div>

                                <div className="prof-form-footer">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="btn-ista prof-submit-btn"
                                    >
                                        {loading ? "ENREGISTREMENT..." : <><Save className="prof-submit-icon" /> ENREGISTRER LES MODIFICATIONS</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="prof-form-card fade-up">
                            <div className="prof-form-header">
                                <h3 className="prof-form-title">SÉCURISATION <span className="prof-form-title-highlight">DU COMPTE</span></h3>
                                <p className="prof-form-subtitle">RENFORCEZ LA PROTECTION DE VOTRE ACCÈS</p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="prof-form">
                                <div className="prof-input-group">
                                    <label className="prof-input-label">
                                        <Key className="prof-label-icon text-red" /> MOT DE PASSE ACTUEL
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.currentPassword}
                                        onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="prof-input input-danger"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="prof-form-grid">
                                    <div className="prof-input-group">
                                        <label className="prof-input-label">
                                            <Lock className="prof-label-icon" /> NOUVEAU MOT DE PASSE
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="prof-input"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="prof-input-group">
                                        <label className="prof-input-label">
                                            <Lock className="prof-label-icon" /> CONFIRMER LE NOUVEAU MOT DE PASSE
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="prof-input"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="prof-form-footer prof-form-footer-pw">
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="prof-submit-pw-btn"
                                    >
                                        {loading ? "MISE À JOUR..." : "ACTUALISER LE MOT DE PASSE"}
                                    </button>
                                    <p className="prof-pw-hint">
                                        <Info className="prof-pw-hint-icon" /> Utilisation recommandée de 8 caractères minimum
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
