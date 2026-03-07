import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';

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
            setError(err.response?.data?.message || 'Unauthorized Access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
            <div className="w-full max-w-sm space-y-12 fade-up">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter text-[var(--text)]">OFPPT</h1>
                    <p className="text-xs uppercase tracking-[0.4em] text-[var(--text-muted)]">Attendance Intelligence</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-lg border-b border-[var(--border)] bg-transparent text-[var(--text)]"
                            placeholder="admin@ofppt.ma"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Security Key</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-lg border-b border-[var(--border)] bg-transparent text-[var(--text)]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-center text-red-500 bg-[var(--surface-hover)] py-2 tracking-wide uppercase italic border border-red-500/20">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-noir py-5 group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <span>Enter System</span>
                                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>
                </form>

                <div className="pt-12 border-t border-[var(--border)] text-center">
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">© 2025 Digital Architecture Division</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
