import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    FileText,
    Activity,
    Shield,
    Globe,
    BarChart3,
    GraduationCap,
    CheckCircle
} from 'lucide-react';
import axios from 'axios';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        total_formateurs: 0,
        total_classes: 0,
        total_reports: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/summary', config);
                setStats(res.data.summary);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const summary = [
        { label: 'Total Stagiaires', value: stats.total_students, icon: Users, status: 'ACTIF' },
        { label: 'Formateurs', value: stats.total_formateurs, icon: GraduationCap, status: 'EN LIGNE' },
        { label: 'Groupes Actifs', value: stats.total_classes, icon: BookOpen, status: 'OUVERT' },
        { label: 'Rapports Générés', value: stats.total_reports, icon: FileText, status: 'ARCHIVÉ' },
    ];

    const attendanceHistory = [
        { name: 'Lun', rate: 94 }, { name: 'Mar', rate: 96 }, { name: 'Mer', rate: 92 },
        { name: 'Jeu', rate: 89 }, { name: 'Ven', rate: 95 }, { name: 'Sam', rate: 88 },
    ];

    const distribution = [
        { name: 'PRÉSENT', value: 88 },
        { name: 'ABSENT', value: 12 },
    ];

    const COLORS = ['var(--primary)', 'var(--secondary)'];

    return (
        <div className="space-y-10 fade-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-pulse"></div>
                        <span className="text-[9px] lg:text-[10px] font-black tracking-widest text-[var(--primary)] uppercase">ISTA DIGITAL HUB</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-[0.9]">Vue d'ensemble</h1>
                    <p className="text-[var(--text-muted)] text-[9px] lg:text-[11px] tracking-widest uppercase font-bold">Statistiques et Analyse des Présences</p>
                </div>
                <div className="flex gap-4 justify-end">
                    <button className="btn-ista px-8 py-3 group shadow-lg">
                        <Activity className="w-4 h-4 mr-2" />
                        <span>Synchronisation</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summary.map((item, i) => (
                    <div key={i} className="ista-card p-8 group relative overflow-hidden bg-white">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-transparent opacity-[0.03] rounded-bl-full"></div>
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-12 h-12 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-black tracking-widest text-[var(--primary)] bg-green-50 px-2 py-1 rounded border border-green-100">
                                {item.status}
                            </span>
                        </div>
                        <h2 className="text-5xl font-black text-[var(--secondary)] tracking-tight mb-1">
                            {loading ? '...' : item.value}
                        </h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-8 ista-panel p-8 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">Évolution de la Présence</h3>
                            <p className="text-[9px] text-[var(--text-muted)] uppercase mt-1">Taux hebdomadaire global</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-green-50 text-[var(--primary)] text-[9px] font-bold rounded border border-green-100 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div> Semaine en cours
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceHistory}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Section */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="ista-panel p-8 bg-white shadow-sm h-full flex flex-col">
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)] mb-6">Répartition par État</h3>

                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="absolute text-center">
                                <p className="text-4xl font-black text-[var(--primary)]">88%</p>
                                <p className="text-[9px] font-bold tracking-widest text-[var(--text-muted)] uppercase">PRÉSENCES</p>
                            </div>
                            <ResponsiveContainer width="100%" height="220">
                                <PieChart>
                                    <Pie
                                        data={distribution}
                                        innerRadius={75}
                                        outerRadius={95}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3 mt-8">
                            {distribution.map((d, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-[var(--surface-hover)] rounded-xl group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}></div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{d.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[var(--secondary)]">{d.value}%</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full btn-ista btn-ista-secondary mt-auto py-5 flex items-center justify-center gap-3 shadow-lg">
                            <FileText className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Générer Rapport Global</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
