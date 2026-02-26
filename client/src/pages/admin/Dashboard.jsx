import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    Calendar,
    FileText,
    TrendingUp,
    AlertCircle,
    Plus,
    Filter,
    Activity,
    Shield,
    Globe,
    ExternalLink
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
    Cell,
    BarChart,
    Bar
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
                const res = await axios.get('http://localhost:5000/api/admin/summary', config);
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
        { label: 'Network Entities', value: stats.total_students, icon: Users, trend: 'SENSORY_ACTIVE' },
        { label: 'Supervisors', value: stats.total_formateurs, icon: Shield, trend: 'AUTHORIZED' },
        { label: 'Active Clusters', value: stats.total_classes, icon: BookOpen, trend: 'DEPOLYED' },
        { label: 'Total Logs', value: stats.total_reports, icon: FileText, trend: 'ARCHIVED' },
    ];

    const attendanceHistory = [
        { name: '01', rate: 94 }, { name: '02', rate: 96 }, { name: '03', rate: 92 },
        { name: '04', rate: 89 }, { name: '05', rate: 95 }, { name: '06', rate: 88 },
        { name: '07', rate: 91 }, { name: '08', rate: 93 }, { name: '09', rate: 97 },
    ];

    const distribution = [
        { name: 'PRESENT', value: 88 },
        { name: 'ABSENT', value: 12 },
    ];

    const COLORS = ['var(--primary)', 'var(--border-strong)'];

    return (
        <div className="space-y-12 fade-up transition-colors duration-500">
            {/* Mission Header */}
            <div className="flex items-end justify-between border-b border-[var(--border-strong)] pb-12 transition-colors duration-500">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[var(--primary)] animate-pulse"></div>
                        <span className="text-[10px] font-black tracking-[0.5em] text-[var(--primary)] uppercase">System Hub Alpha</span>
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter text-[var(--primary)] uppercase italic transition-colors duration-500">Overview</h1>
                    <p className="text-[var(--text-muted)] text-xs tracking-[0.4em] uppercase font-bold transition-colors duration-500">Central Intelligence & Neural Metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right mr-8 hidden md:block">
                        <p className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase mb-1">Last Update</p>
                        <p className="text-xs font-bold font-mono text-[var(--primary)] uppercase">{new Date().toLocaleTimeString()}</p>
                    </div>
                    <button className="btn-noir px-8 py-3 group">
                        <Activity className="w-3 h-3 mr-2 animate-spin-slow group-hover:text-[var(--primary-text)]" />
                        <span>Live Sync</span>
                    </button>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-strong)] border border-[var(--border-strong)] transition-colors duration-500 shadow-2xl">
                {summary.map((item, i) => (
                    <div key={i} className="bg-[var(--surface)] p-12 hover:bg-[var(--surface-hover)] transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 border border-[var(--border)] rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-16 relative">
                            <div className="w-12 h-12 bg-[var(--primary)] text-[var(--background)] flex items-center justify-center transition-all duration-500 group-hover:rotate-12">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] font-black tracking-[0.3em] text-[var(--primary)] uppercase border border-[var(--primary)] px-2 py-1 leading-none">
                                    {item.trend}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-6xl font-black text-[var(--primary)] tracking-tighter mb-2 transition-colors duration-500 italic">
                            {loading ? '---' : item.value}
                        </h2>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Analytic Stream */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] transition-colors duration-500">Attendance Velocity Path</h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 bg-[var(--primary)]"></div>
                            <div className="w-2 h-2 bg-[var(--border-strong)]"></div>
                        </div>
                    </div>
                    <div className="h-[450px] border border-[var(--border-strong)] p-12 transition-colors duration-500 bg-[var(--surface)] relative group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-20"></div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceHistory}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-muted)" fontSize={9} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--primary)', borderRadius: '0', padding: '12px' }}
                                    itemStyle={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                    labelStyle={{ color: 'var(--text-muted)', fontSize: '8px', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Nodes */}
                <div className="lg:col-span-4 space-y-8">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)] transition-colors duration-500">Entity Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center relative bg-[var(--surface)] border border-[var(--border-strong)]">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-4xl font-black italic text-[var(--primary)]">88%</p>
                                <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">Present</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    innerRadius={90}
                                    outerRadius={110}
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

                    <div className="grid grid-cols-1 gap-px bg-[var(--border-strong)] border border-[var(--border-strong)]">
                        {distribution.map((d, i) => (
                            <div key={i} className="bg-[var(--surface)] p-6 flex justify-between items-center group hover:bg-[var(--surface-hover)] transition-colors duration-500">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 ${i === 0 ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]'}`}></div>
                                    <span className="text-[10px] font-black tracking-[0.2em] text-[var(--text-muted)] uppercase">{d.name}</span>
                                </div>
                                <span className="text-lg font-black text-[var(--primary)] italic">{d.value}%</span>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-[var(--primary)] text-[var(--background)] py-6 flex items-center justify-center gap-3 group transition-all duration-500 hover:tracking-[0.2em]">
                        <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">Security Protocol Report</span>
                    </button>

                    <div className="p-8 border border-[var(--border-strong)] border-dashed opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-3 h-3" />
                            <span className="text-[8px] font-black tracking-widest uppercase text-[var(--primary)]">Global Feed</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-[var(--text-muted)] uppercase tracking-tighter">
                            Awaiting uplink from secondary nodes. All systems operational in current sector.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
