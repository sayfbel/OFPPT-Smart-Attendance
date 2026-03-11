import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2, ShieldCheck } from 'lucide-react';
import ofpptLogo from '../assets/OFPPT.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'url("/bg_pattern.png")', backgroundSize: 'cover' }}></div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] opacity-[0.03] blur-[120px] rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)] opacity-[0.03] blur-[120px] rounded-full -ml-48 -mb-48"></div>

            <div className="w-full max-w-sm space-y-10 fade-up relative z-10">
                <div className="text-center space-y-6">
                    <img
                        src={ofpptLogo}
                        alt="OFPPT Logo"
                        className="h-24 mx-auto drop-shadow-sm"
                    />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black tracking-tight text-[var(--secondary)]">PORTAIL ISTA</h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] font-bold">Système de Gestion des Présences</p>
                    </div>
                </div>

                <div className="ista-panel p-8 space-y-8 bg-white/80 backdrop-blur-sm shadow-xl border-white/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Adresse Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-base"
                                placeholder="name@ofppt.ma"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-[10px] text-center text-red-600 bg-red-50 py-3 px-4 rounded-lg font-bold uppercase tracking-wide border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-ista py-4 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span>Se connecter</span>
                                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                <div className="pt-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShieldCheck className="w-3 h-3 text-[var(--primary)]" />
                        <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-medium">Connexion sécurisée ISTA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
