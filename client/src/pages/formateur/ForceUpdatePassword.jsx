import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Key, Save, Lock, AlertCircle, Shield } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const ForceUpdatePassword = () => {
    const { user, logout } = useAuth();
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
            
            // Re-fetch user or just redirect
            window.location.href = '/formateur';
        } catch (err) {
            addNotification(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 fade-up max-w-[1000px] mx-auto pb-20">
            {/* Header section with high-fidelity typography */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-[var(--primary)] mb-2">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <Key className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">PROTOCOLE DE SÉCURITÉ OBLIGATOIRE</span>
                </div>
                <h1 className="text-5xl md:text-[64px] font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">
                    Mise à jour du <span className="text-[var(--primary)] shrink-0">Mot de Passe</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase max-w-2xl">
                    PREMIÈRE CONNEXION DÉTECTÉE. VEUILLEZ PERSONNALISER VOS ACCÈS POUR ACTIVER LES SERVICES DU PORTAIL.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white border border-slate-100 rounded-[48px] p-10 md:p-16 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <Lock className="w-3 h-3 text-[var(--primary)]" /> NOUVEAU MOT DE PASSE
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <Lock className="w-3 h-3 text-[var(--primary)]" /> CONFIRMER LE MOT DE PASSE
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold text-[var(--secondary)] focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-50">
                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full md:w-auto px-12 py-5 bg-[var(--primary)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? "INITIALISATION..." : <><Save className="w-4 h-4" /> ACTIVER MON COMPTE DÉFINITIVEMENT</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center gap-4 p-8 bg-amber-50 border border-amber-100 rounded-[32px] text-amber-700">
                        <AlertCircle className="w-8 h-8 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Rappel de Sécurité</p>
                            <p className="text-[9px] font-bold uppercase leading-relaxed opacity-80">
                                Ne communiquez jamais votre mot de passe. Le système de l'OFPPT ne vous demandera jamais ces informations par email ou par téléphone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Area */}
                <div className="space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-3xl group-hover:bg-[var(--primary)]/20 transition-colors"></div>
                        <Shield className="w-10 h-10 text-[var(--primary)] mb-6" />
                        <h4 className="text-sm font-black italic uppercase tracking-tight mb-4 leading-snug">Protection Étendue de l'Identité Digitale</h4>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                            Votre mot de passe est la clé de votre espace pédagogique sécurisé. Choisissez une combinaison complexe mêlant majuscules, chiffres et symboles.
                        </p>
                    </div>

                    <button 
                        onClick={() => logout()}
                        className="w-full py-6 bg-slate-50 border border-slate-100 text-slate-400 rounded-[32px] text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-3"
                    >
                        ANNULER ET DÉCONNEXION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForceUpdatePassword;
