import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import { Save, Lock, AlertCircle, Shield, X } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import './ForceUpdatePassword.css';

const ForceUpdatePassword = () => {
    const { user, logout, setSkipPasswordUpdate } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return addNotification("Les mots de passe ne correspondent pas", "error");
        }
        if (passwords.newPassword.length < 6) {
            return addNotification("Le mot de passe doit contenir au moins 6 caractères", "error");
        }

        setLoading(true);
        try {
            await authService.forceUpdatePassword(undefined, passwords.newPassword);
            addNotification("Mot de passe initialisé avec succès. Bienvenue !", "success");
            
            // Just redirect to dashboard, first_login is now false in DB
            window.location.href = '/formateur';
        } catch (err) {
            addNotification(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        setSkipPasswordUpdate(true);
        navigate('/formateur');
    };

    return (
        <div className="fup-container fade-up">
            <div className="fup-card group">
                {/* Decorative background element */}
                <div className="fup-decorative-glow"></div>
                
                <div className="fup-content">
                    {/* Header */}
                    <div className="fup-header">
                        <div className="fup-icon-wrapper">
                            <Lock className="fup-icon" />
                        </div>
                        <h1 className="fup-title">
                            Protection <span className="fup-title-highlight">Compte</span>
                        </h1>
                        <p className="fup-subtitle">
                            VEUILLEZ DÉFINIR VOTRE MOT DE PASSE POUR SÉCURISER VOTRE ACCÈS AU PORTAIL ISTA.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="fup-form">
                        <div className="fup-form-grid">
                            <div className="fup-input-group">
                                <label className="fup-input-label">
                                    <Shield className="fup-label-icon" /> NOUVEAU
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="fup-input"
                                />
                            </div>
                            <div className="fup-input-group">
                                <label className="fup-input-label">
                                    <Shield className="fup-label-icon" /> CONFIRMER
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="fup-input"
                                />
                            </div>
                        </div>

                        <div className="fup-actions">
                            <button 
                                disabled={loading}
                                type="submit"
                                className="fup-submit-btn"
                            >
                                {loading ? "CHARGEMENT..." : <><Save className="fup-btn-icon" /> ACTIVER MON COMPTE</>}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={handleSkip}
                                className="fup-skip-btn"
                            >
                                PLUS TARD
                            </button>
                        </div>
                    </form>

                    <div className="fup-alert">
                        <AlertCircle className="fup-alert-icon" />
                        <p className="fup-alert-text">
                            LE MOT DE PASSE DOIT ÊTRE UNIQUE ET CONTENIR AU MOINS 6 CARACTÈRES POUR UNE SÉCURITÉ OPTIMALE.
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => logout()}
                className="fup-logout-btn"
            >
                <X className="fup-logout-icon" /> ANNULER ET SE DÉCONNECTER
            </button>
        </div>
    );
};

export default ForceUpdatePassword;
