import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle2, XCircle, Clock, TrendingUp, Cpu, Lock, Shield, User, Scan, FileText } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StagiaireIdentityModal from '../../components/StagiaireIdentityModal';
import { useNotification } from '../../context/NotificationContext';

const StagiaireDashboard = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [isHighlighting, setIsHighlighting] = useState(false);

    const triggerHighlight = () => {
        setIsHighlighting(true);
        setTimeout(() => setIsHighlighting(false), 2000);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `http://localhost:5000${path}`;
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/stagiaire/profile', config);
            setProfile(res.data.profile);

            // Success Notification Condition
            if (res.data.profile.image && res.data.profile.face_id) {
                // If they just completed it and were on this page, it's nice to notify, 
                // but usually the modal does that. 
            }
        } catch (error) {
            console.error('Registry link failure', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white italic tracking-[0.5em] font-black uppercase">INITIALIZING_NEURAL_NODE...</div>;
    }

    // Force Onboarding Check
    const isIncomplete = !profile?.image || !profile?.face_id;

    if (isIncomplete) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center p-8 fade-up text-left">
                <div className="w-full max-w-5xl border border-[var(--border-strong)] bg-[var(--surface)]/10 p-16 relative overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Lock className="w-64 h-64 text-white" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase italic">Security Protocol :: Access Restricted</span>
                                <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase italic leading-tight">Identity<br />Required</h1>
                                <div className="w-16 h-1 bg-red-500"></div>
                            </div>

                            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase leading-[2] max-w-md">
                                Your neural signature is incomplete. To activate your account within the squadron network, you must complete the mandatory identification tasks listed on the right.
                            </p>

                            <div className="pt-8">
                                <button
                                    onClick={() => {
                                        triggerHighlight();
                                        setTimeout(() => setIsIdModalOpen(true), 600);
                                    }}
                                    onMouseEnter={() => setIsHighlighting(true)}
                                    onMouseLeave={() => setIsHighlighting(false)}
                                    className="bg-white text-black px-12 py-5 font-black tracking-[0.3em] text-[11px] hover:bg-zinc-200 transition-all border border-white flex items-center gap-4 group"
                                >
                                    <Scan className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                                    INITIALIZE_ONBOARDING
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase mb-8">Pending Activation Tasks</h3>

                            <div className="space-y-6">
                                {/* Task 1: Image Upload */}
                                <div className={`p-8 border transition-all duration-700 ${profile?.image ? 'border-green-500/30 bg-green-500/5' : isHighlighting && !profile?.image ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] scale-[1.02]' : 'border-zinc-800 bg-zinc-900/50 grayscale hover:grayscale-0'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 border ${profile?.image || (isHighlighting && !profile?.image) ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-zinc-700 text-zinc-700'}`}>
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className={`text-[11px] font-black tracking-widest uppercase ${profile?.image || (isHighlighting && !profile?.image) ? 'text-[var(--primary)]' : 'text-zinc-400'}`}>Digital Avatar Sync</h4>
                                                <p className="text-[9px] font-bold text-zinc-600 tracking-widest uppercase mt-1">Status: {profile?.image ? 'VERIFIED' : 'PENDING'}</p>
                                            </div>
                                        </div>
                                        {profile?.image ? (
                                            <div className="w-2 h-2 bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                        ) : (
                                            <div className={`w-2 h-2 ${isHighlighting ? 'bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-pulse' : 'bg-zinc-800'}`}></div>
                                        )}
                                    </div>
                                    {!profile?.image && (
                                        <button
                                            onClick={() => setIsIdModalOpen(true)}
                                            className="text-[9px] font-black tracking-[0.3em] text-[var(--primary)] uppercase hover:text-white transition-colors"
                                        >
                                            [UPLOAD_IDENTITY_ASSET]
                                        </button>
                                    )}
                                </div>

                                {/* Task 2: Face Scan */}
                                <div className={`p-8 border transition-all duration-700 ${profile?.face_id ? 'border-green-500/30 bg-green-500/5' : isHighlighting && !profile?.face_id ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] scale-[1.02]' : 'border-zinc-800 bg-zinc-900/50 grayscale hover:grayscale-0'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 border ${profile?.face_id || (isHighlighting && !profile?.face_id) ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-zinc-700 text-zinc-700'}`}>
                                                <Scan className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className={`text-[11px] font-black tracking-widest uppercase ${profile?.face_id || (isHighlighting && !profile?.face_id) ? 'text-[var(--primary)]' : 'text-zinc-400'}`}>Biometric Neural Scan</h4>
                                                <p className="text-[9px] font-bold text-zinc-600 tracking-widest uppercase mt-1">Status: {profile?.face_id ? 'SYNCHRONIZED' : 'PENDING'}</p>
                                            </div>
                                        </div>
                                        {profile?.face_id ? (
                                            <div className="w-2 h-2 bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                        ) : (
                                            <div className={`w-2 h-2 ${isHighlighting ? 'bg-[var(--primary)] shadow-[0_0_15px_var(--primary)] animate-pulse' : 'bg-zinc-800'}`}></div>
                                        )}
                                    </div>
                                    {!profile?.face_id && (
                                        <button
                                            onClick={() => setIsIdModalOpen(true)}
                                            className="text-[9px] font-black tracking-[0.3em] text-[var(--primary)] uppercase hover:text-white transition-colors"
                                        >
                                            [RUN_FACIAL_TELEMETRY]
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <StagiaireIdentityModal
                    isOpen={isIdModalOpen}
                    onClose={() => setIsIdModalOpen(false)}
                    profile={profile}
                    onUpdate={fetchProfile}
                />
            </div>
        );
    }

    const stats = [
        { label: 'Integrity Rate', value: '92%', icon: TrendingUp },
        { label: 'Active Logs', value: '45', icon: CheckCircle2 },
        { label: 'Void State', value: '04', icon: XCircle },
        { label: 'Delay Events', value: '02', icon: Clock },
    ];

    const chartData = [
        { name: 'M', attendance: 100 },
        { name: 'T', attendance: 80 },
        { name: 'W', attendance: 100 },
        { name: 'T', attendance: 90 },
        { name: 'F', attendance: 100 },
    ];

    return (
        <div className="space-y-16 fade-up">
            <StagiaireIdentityModal
                isOpen={isIdModalOpen}
                onClose={() => setIsIdModalOpen(false)}
                profile={profile}
                onUpdate={fetchProfile}
            />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <p className="text-zinc-600 text-[10px] tracking-[0.5em] font-black uppercase italic">Authentication :: Node {profile?.id || '2025'}</p>
                    <div className="flex items-center gap-8">
                        <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic">{profile?.name}</h1>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-[8px] font-black tracking-widest text-green-500 uppercase italic">Verified_Node</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsIdModalOpen(true)} className="btn-noir px-8 py-4 border border-zinc-800">
                        <User className="w-3 h-3 mr-3" />
                        <span>Personnel Dossier</span>
                    </button>
                    <button
                        onClick={() => navigate('/stagiaire/absences')}
                        className="btn-noir px-10 py-4 bg-white text-black"
                    >
                        <FileText className="w-3 h-3 mr-3" />
                        <span>Absences</span>
                    </button>
                </div>
            </div>

            {/* Entity Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-black p-10 hover:bg-zinc-950 transition-all group">
                        <stat.icon className="w-4 h-4 text-zinc-800 mb-8 group-hover:text-white transition-colors" />
                        <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</h2>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual ID Cluster */}
                <div className="lg:col-span-1 border border-zinc-900 bg-zinc-950/50 p-12 flex flex-col items-center">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-zinc-500 mb-8">Node_Visual_ID</h3>
                    <div className="w-64 h-80 border border-zinc-800 p-8 flex items-center justify-center relative overflow-hidden group">

                        {profile?.image ? (
                            <img src={getImageUrl(profile.image)} alt="ID" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <QrCode className="w-full h-full text-zinc-800 stroke-[0.5]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <span className="text-[8px] font-black text-white/50 tracking-[0.2em]">{profile?.name?.toUpperCase()} // NODE-{profile?.id}</span>
                        </div>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-zinc-500">Pulse Analytics</h3>
                    <div className="border border-zinc-900 p-10 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="0" stroke="#111" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#333"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#333"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `${v}%`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#0a0a0a' }}
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: '1px solid #222',
                                        borderRadius: '0',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Bar
                                    dataKey="attendance"
                                    fill="#fff"
                                    radius={0}
                                    barSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StagiaireDashboard;

