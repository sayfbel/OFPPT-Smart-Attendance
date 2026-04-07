import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Key, Save, Lock, AlertCircle, Shield, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

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
            const token = localStorage.getItem('token');
            await axios.put('/api/formateur/force-update-password', 
                { newPassword: passwords.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
        <div className="min-h-[70vh] flex flex-col items-center justify-center fade-up max-w-[800px] mx-auto">
            <div className="w-full bg-white dark:bg-[var(--surface)] border border-[var(--border)] rounded-[48px] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="relative z-10 space-y-10">
                    {/* Simplified Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary)]/10 rounded-3xl text-[var(--primary)] mb-4 animate-bounce-slow">
                            <Lock className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--secondary)] uppercase italic leading-none">
                            Protection <span className="text-[var(--primary)]">Compte</span>
                        </h1>
                        <p className="text-[11px] text-slate-400 font-bold tracking-[0.2em] uppercase max-w-md mx-auto">
                            VEUILLEZ DÉFINIR VOTRE MOT DE PASSE POUR SÉCURISER VOTRE ACCÈS AU PORTAIL ISTA.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">
                                    <Shield className="w-3 h-3 text-[var(--primary)]" /> NOUVEAU
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">
                                    <Shield className="w-3 h-3 text-[var(--primary)]" /> CONFIRMER
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                            <button 
                                disabled={loading}
                                type="submit"
                                className="w-full sm:flex-1 py-6 bg-[var(--primary)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? "CHARGEMENT..." : <><Save className="w-4 h-4" /> ACTIVER MON COMPTE</>}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={handleSkip}
                                className="w-full sm:w-auto px-10 py-6 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-[var(--primary)] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-200"
                            >
                                PLUS TARD
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-black/10 rounded-2xl border border-dashed border-slate-200 dark:border-white/5 opacity-80">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-[9px] font-bold uppercase text-slate-400 leading-tight">
                            LE MOT DE PASSE DOIT ÊTRE UNIQUE ET CONTENIR AU MOINS 6 CARACTÈRES POUR UNE SÉCURITÉ OPTIMALE.
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => logout()}
                className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all flex items-center gap-2"
            >
                <X className="w-4 h-4" /> ANNULER ET SE DÉCONNECTER
            </button>
        </div>
    );
};

export default ForceUpdatePassword;
