import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    LayoutDashboard,
    ChevronDown
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
    const [period, setPeriod] = useState('weekly');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [globalRate, setGlobalRate] = useState(100);
    const [evolutionData, setEvolutionData] = useState([]);
    const [distributionData, setDistributionData] = useState([]);
    const [criticalStudents, setCriticalStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [usersRes, groupsRes, reportsRes, summaryRes] = await Promise.all([
                axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/groups', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`/api/admin/summary?period=${period}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const users = usersRes.data.users || [];
            const summary = summaryRes.data.summary;

            setStats({
                totalStudents: summary.total_students,
                totalFormateurs: summary.total_formateurs,
                totalGroups: summary.total_groups,
                totalReports: summary.total_reports
            });

            setGlobalRate(summary.global_rate || 100);

            // Process Evolution Data
            if (summary.evolution) {
                setEvolutionData(summary.evolution);
            }

            // Process Distribution Data
            if (summary.distribution) {
                const total = summary.distribution.reduce((acc, curr) => acc + curr.count, 0);
                const colors = {
                    'PRESENT': '#22c55e',
                    'ABSENT': '#ef4444',
                    'LATE': '#f59e0b'
                };
                const processedDistribution = summary.distribution.map(item => ({
                    name: t(`dashboard.${item.status.toLowerCase()}`) || item.status,
                    value: total > 0 ? Math.round((item.count / total) * 100) : 0,
                    count: item.count,
                    color: colors[item.status] || '#94a3b8'
                }));
                setDistributionData(processedDistribution);
            }

            // Filter critical students (any absences > 0 for visibility)
            const critical = users
                .filter(u => u.role === 'stagiaire' && u.absences > 0)
                .sort((a, b) => b.absences - a.absences)
                .slice(0, 5);
            setCriticalStudents(critical);
        } catch (error) {
            console.error('Error fetching stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period]);

    const chartData = evolutionData.length > 0 ? evolutionData : [
        { name: 'LUN', rate: 0 },
        { name: 'MAR', rate: 0 },
        { name: 'MER', rate: 0 },
        { name: 'JEU', rate: 0 },
        { name: 'VEN', rate: 0 }
    ];

    const pieData = distributionData.length > 0 ? distributionData : [
        { name: t('dashboard.present'), value: 100, color: '#22c55e' },
        { name: t('dashboard.absent'), value: 0, color: '#ef4444' }
    ];

    const currentAttendanceRate = evolutionData.length > 0 
        ? evolutionData[evolutionData.length - 1].rate 
        : (distributionData.find(d => d.name === t('dashboard.present'))?.value || 0);

    const averageAttendanceRate = evolutionData.length > 0
        ? Math.round(evolutionData.reduce((acc, curr) => acc + curr.rate, 0) / evolutionData.length)
        : currentAttendanceRate;

    const filteredStudents = criticalStudents.filter(u => u.last_justifier === 'ABSENCE');

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

                <button
                    onClick={fetchStats}
                    className="flex items-center gap-3 p-4 bg-white border border-[var(--border)] rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-[var(--surface-hover)] transition-all shadow-sm group"
                >
                    <RefreshCw className={`w-4 h-4 text-[var(--primary)] transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
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

            {/* Critical Absences & Surveillance Section */}
            <div className="ista-panel p-10 bg-white border-l-8 border-[var(--primary)] shadow-xl animate-in slide-in-from-left duration-700">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${criticalStudents.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                            {criticalStudents.length > 0 ? (
                                <XCircle className="w-6 h-6 text-red-500 animate-pulse" />
                            ) : (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[var(--secondary)] uppercase tracking-tighter">
                                {t('dashboard.critical_absences_title') || 'Surveillance des Absences'}
                            </h3>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-60">
                                {criticalStudents.length > 0
                                    ? t('dashboard.critical_absences_subtitle') || 'Stagiaires sous surveillance étroite'
                                    : 'Tous les stagiaires sont en règle avec le règlement de présence.'}
                            </p>
                        </div>
                    </div>
                    {criticalStudents.length > 0 && (
                        <div className="px-4 py-2 bg-red-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">
                            {criticalStudents.length} {t('dashboard.alerts_active') || 'ALERTE(S) ACTIVE(S)'}
                        </div>
                    )}
                </div>

                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {filteredStudents.map((stg, i) => (
                            <Link
                                to={`/admin/student/${stg.id}`}
                                key={i}
                                className="p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-red-200 hover:bg-red-50/30 transition-all duration-300 block cursor-pointer"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${stg.absences >= 7 ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'}`}>
                                            {stg.absences}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-[var(--secondary)]">{stg.group_id}</span>
                                            <span className="text-[8px] font-bold text-[var(--text-muted)] opacity-60 uppercase">{stg.id}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-black text-[var(--secondary)] text-sm truncate uppercase tracking-tighter group-hover:text-red-600 transition-colors">
                                            {stg.name}
                                        </h4>
                                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                                            {stg.filiere || 'Filière non spécifiée'}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200/60 mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">
                                                {stg.absences >= 7 ? 'CRITIQUE' : 'ATTENTION'}
                                            </span>
                                            {stg.last_status === 'ABSENT' && (
                                                <span className="text-[7px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded mt-1 animate-pulse w-fit">
                                                    RÉCIDIVE
                                                </span>
                                            )}
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                        <Activity className="w-12 h-12 text-slate-200 mb-4" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Aucune anomalie détectée sur ce campus</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Graph */}
                <div className="xl:col-span-2 ista-panel p-10 bg-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                            <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]">{t('dashboard.attendance_evolution')}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                                    className="flex items-center gap-3 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all text-[9px] font-black tracking-widest text-[var(--secondary)] uppercase"
                                >
                                    <svg className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span>
                                        {period === 'weekly' ? (t('dashboard.period_weekly') || 'Hebdomadaire') : (t('dashboard.period_monthly') || 'Mensuel')}
                                    </span>
                                    <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showPeriodDropdown && (
                                    <div className="absolute top-full mt-2 right-0 w-max min-w-[160px] bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden fade-up">
                                        <button 
                                            onClick={() => { setPeriod('weekly'); setShowPeriodDropdown(false); }}
                                            className={`w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-colors ${period === 'weekly' ? 'bg-[var(--primary)]/5 text-[var(--primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {t('dashboard.period_weekly') || 'Hebdomadaire'}
                                        </button>
                                        <button 
                                            onClick={() => { setPeriod('monthly'); setShowPeriodDropdown(false); }}
                                            className={`w-full text-left px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-colors ${period === 'monthly' ? 'bg-[var(--primary)]/5 text-[var(--primary)]' : 'text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {t('dashboard.period_monthly') || 'Mensuel'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-[var(--primary)]">{globalRate}%</span>
                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{t('dashboard.weekly_rate')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
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
                                <YAxis hide domain={[0, 100]} />
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

                </div>

                {/* Status Distribution */}
                <div className="ista-panel p-10 bg-blue-600 text-[var(--secondary)] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></div>
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--secondary)]/60">{t('dashboard.distribution_title')}</h3>
                    </div>

                    <div className="relative h-[280px]">
                        {/* Hover Information Display at the Top */}
                        {activeIndex !== null && (
                            <div className="absolute -top-4 left-0 right-0 flex justify-center z-10 fade-up">
                                <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pieData[activeIndex].color }}></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{pieData[activeIndex].name}: {pieData[activeIndex].value}%</span>
                                </div>
                            </div>
                        )}

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                                            style={{ filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none', transition: 'all 0.3s ease' }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black italic">{globalRate}%</span>
                            <span className="text-[8px] font-black text-white/40 tracking-widest uppercase">{t('dashboard.attendance_rate')}</span>
                        </div>
                    </div>

                    <div className="mt-10 space-y-3">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[22px] shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${item.color}15` }}>
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 group-hover:text-slate-600 transition-colors">{item.name}</span>
                                        <span className="text-sm font-black text-slate-700">{item.count}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black italic" style={{ color: item.color }}>{item.value}%</span>
                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{t('dashboard.ratio')}</span>
                                </div>
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
