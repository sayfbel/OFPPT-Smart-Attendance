import React, { useState, useEffect } from 'react';
import {
    Users,
    Key,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpRight,
    TrendingUp,
    Calendar,
    FileText,
    RefreshCw,
    Briefcase,
    LayoutDashboard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFormateurs: 0,
        totalGroups: 0,
        totalReports: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [usersRes, groupsRes, reportsRes] = await Promise.all([
                    axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/groups', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const users = usersRes.data.users || [];
                setStats({
                    totalStudents: users.filter(u => u.role === 'stagiaire').length,
                    totalFormateurs: users.filter(u => u.role === 'formateur').length,
                    totalGroups: (groupsRes.data.groups || []).length,
                    totalReports: (reportsRes.data.reports || []).length
                });
            } catch (error) {
                console.error('Error fetching stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const daySlugs = t('datepicker.days', { returnObjects: true });
    // chartData needs LUN, MAR, MER, JEU, VEN
    const data = [
        { name: daySlugs[1], rate: 85 },
        { name: daySlugs[2], rate: 92 },
        { name: daySlugs[3], rate: 88 },
        { name: daySlugs[4], rate: 95 },
        { name: daySlugs[5], rate: 78 }
    ];

    const pieData = [
        { name: t('dashboard.present'), value: 85, color: '#22c55e' },
        { name: t('dashboard.absent'), value: 15, color: '#ef4444' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border)] pb-10 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-green-500/20">
                            {t('dashboard.hub_name')}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-[var(--secondary)] uppercase italic leading-none">
                        {t('dashboard.overview_title')}
                    </h1>
                    <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-[0.3em] uppercase opacity-70">
                        {t('dashboard.overview_subtitle')}
                    </p>
                </div>

                <button className="flex items-center gap-3 p-4 bg-white border border-[var(--border)] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-[var(--surface-hover)] transition-all shadow-sm group">
                    <RefreshCw className="w-4 h-4 text-[var(--primary)] group-hover:rotate-180 transition-transform duration-500" />
                    {t('dashboard.sync_button')}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: t('dashboard.total_students'), value: stats.totalStudents, icon: Users, color: 'var(--primary)', tag: t('dashboard.status_active') },
                    { label: t('dashboard.total_formateurs'), value: stats.totalFormateurs, icon: Briefcase, color: 'royalblue', tag: t('dashboard.status_online') },
                    { label: t('dashboard.total_groups'), value: stats.totalGroups, icon: LayoutDashboard, color: 'var(--secondary)', tag: t('dashboard.status_open') },
                    { label: t('dashboard.total_reports'), value: stats.totalReports, icon: FileText, color: 'orange', tag: t('dashboard.status_archived') }
                ].map((stat, i) => (
                    <div key={i} className="ista-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl w-fit group-hover:bg-white transition-colors">
                                    <stat.icon className="w-5 h-5 text-[var(--text-muted)]" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-[var(--secondary)] tracking-tight">
                                        {loading ? '...' : stat.value.toString().padStart(2, '0')}
                                    </h3>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-60">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[8px] font-black px-2 py-1 rounded bg-slate-50 text-[var(--text-muted)] border border-slate-100 group-hover:bg-white">
                                {stat.tag}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Graph */}
                <div className="xl:col-span-2 ista-panel p-10 bg-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('dashboard.attendance_evolution')}</h3>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-[var(--primary)]">94.8%</span>
                            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{t('dashboard.weekly_rate')}</p>
                        </div>
                    </div>

                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '10px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="w-24 h-24 text-slate-50 -rotate-12" />
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="ista-panel p-10 bg-[var(--secondary)] text-white relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-white/60">{t('dashboard.distribution_title')}</h3>
                    </div>

                    <div className="relative h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black italic">85%</span>
                            <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">{t('dashboard.attendance_rate')}</span>
                        </div>
                    </div>

                    <div className="mt-10 space-y-4">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[10px] font-black tracking-widest uppercase">{item.name}</span>
                                </div>
                                <span className="text-sm font-black">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col lg:flex-row items-center justify-between p-8 bg-white border border-[var(--border)] rounded-[32px] shadow-sm gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-[var(--surface-hover)] rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black italic tracking-tight text-[var(--secondary)] uppercase">{t('dashboard.current_week')} : ISTA MIRLEFT</h4>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">ANALYSE OPÉRATIONNELLE EN TEMPS RÉEL</p>
                    </div>
                </div>

                <button className="w-full lg:w-auto btn-ista px-8 py-4 flex items-center justify-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest">{t('dashboard.generate_global_report')}</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
