import React, { useState, useEffect } from 'react';
import { UserX, Calendar, Clock, AlertTriangle, CheckCircle2, FileText, Search, Activity } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const Absence = () => {
    const { addNotification } = useNotification();
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/stagiaire/absences', config);
                setAbsences(res.data.absences || []);
            } catch (error) {
                console.error('Error fetching absences', error);
                addNotification('Failed to sync absence archive.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAbsences();
    }, [addNotification]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white italic tracking-[0.5em] font-black uppercase text-xl">Scanning Absence Registry...</div>;
    }

    const totalAbsences = absences.length;
    const justifiedAbsences = absences.filter(a => a.record_status === 'JUSTIFIED').length;
    const pendingAbsences = totalAbsences - justifiedAbsences;

    return (
        <div className="space-y-16 fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-strong)] pb-12">
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] text-[10px] tracking-[0.5em] font-black uppercase">Neutral Void Records</p>
                    <h1 className="text-7xl font-black tracking-tighter text-[var(--primary)] uppercase italic">Absences</h1>
                </div>
                <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border-strong)] p-6 group hover:border-[var(--primary)] transition-colors">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black tracking-widest text-[var(--text-muted)] uppercase">Total Drift</span>
                        <span className="text-2xl font-black text-red-500 tracking-tighter">{totalAbsences.toString().padStart(2, '0')} HOURS</span>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-strong)] border border-[var(--border-strong)]">
                <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                        <Activity className="w-3 h-3" /> Raw Signal Loss
                    </p>
                    <h2 className="text-6xl font-black text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{totalAbsences.toString().padStart(2, '0')}</h2>
                </div>
                <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Justified Offset
                    </p>
                    <h2 className="text-6xl font-black text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{justifiedAbsences.toString().padStart(2, '0')}</h2>
                </div>
                <div className="bg-[var(--background)] p-12 text-center group hover:bg-[var(--surface-hover)] transition-colors">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> Critical Pending
                    </p>
                    <h2 className="text-6xl font-black text-red-500 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">{pendingAbsences.toString().padStart(2, '0')}</h2>
                </div>
            </div>

            {/* Absence Records Table */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black tracking-[0.5em] uppercase text-[var(--text-muted)]">Verified Void Entries</h3>
                </div>

                <div className="border border-[var(--border-strong)] bg-[var(--background)] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest border-b border-[var(--border-strong)]">
                                <th className="p-8">Operational Date</th>
                                <th className="p-8">Subject Cluster</th>
                                <th className="p-8">Temporal ID</th>
                                <th className="p-8">Venue</th>
                                <th className="p-8 text-right">Registry Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-strong)]">
                            {absences.length > 0 ? absences.map((absence) => (
                                <tr key={absence.id} className="hover:bg-[var(--surface)] transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-[var(--surface-hover)] border border-[var(--border-strong)] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-text)] group-hover:border-[var(--primary)] transition-all">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold tracking-widest text-[var(--text)] uppercase italic group-hover:text-[var(--primary)] transition-colors">
                                                {new Date(absence.date).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-[var(--text-muted)] font-black text-[10px] tracking-[0.2em] uppercase group-hover:text-[var(--text)] transition-colors">
                                        {absence.subject}
                                    </td>
                                    <td className="p-8 text-[var(--text-muted)] font-mono text-[10px] tracking-widest uppercase italic group-hover:text-[var(--text)] transition-colors">
                                        {absence.heure}
                                    </td>
                                    <td className="p-8 text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase group-hover:text-[var(--text)] transition-colors">
                                        {absence.salle}
                                    </td>
                                    <td className="p-8 text-right">
                                        <span className={`text-[9px] font-black tracking-[0.2em] px-4 py-1.5 border transition-all duration-500 ${absence.record_status === 'JUSTIFIED'
                                            ? 'border-[var(--primary)] text-[var(--primary)]'
                                            : 'border-red-950 text-red-500 bg-red-950/20'
                                            }`}>
                                            {absence.record_status || 'UNJUSTIFIED'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-32 text-center group">
                                        <div className="flex flex-col items-center gap-6">
                                            <CheckCircle2 className="w-12 h-12 text-[var(--primary)] animate-pulse" />
                                            <p className="text-[10px] font-black tracking-[0.5em] text-[var(--primary)] uppercase">
                                                CLEAN_SIGNAL :: No absence records found in neural registry
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Absence;
