import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { QrCode, CheckCircle2, XCircle, Clock, TrendingUp, Cpu } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

const StagiaireDashboard = () => {
    const { user } = useAuth();

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
        <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <p className="text-zinc-600 text-[10px] tracking-[0.5em] font-black uppercase italic">Authentication :: Node {user?.id || '2025'}</p>
                    <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic">{user?.name}</h1>
                </div>
                <button className="btn-noir px-10 py-4">
                    <QrCode className="w-3 h-3 mr-3" />
                    <span>Access Code</span>
                </button>
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
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-zinc-500 text-center">Neural Identify</h3>
                    <div className="border border-zinc-900 bg-white p-12 aspect-square flex flex-col items-center justify-center space-y-8 invert">
                        <div className="w-full h-full border border-black p-4 flex items-center justify-center">
                            <QrCode className="w-full h-full text-black stroke-[0.5]" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest px-2">
                        <span className="text-zinc-800 italic uppercase">Log-ID: OFPPT-{user?.id || '24'}</span>
                        <Cpu className="w-3 h-3 text-zinc-400 animate-pulse" />
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
